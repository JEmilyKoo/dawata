package com.ssafy.dawata.domain.recommend.service;

import java.net.URL;
import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.dawata.domain.address.entity.Train;
import com.ssafy.dawata.domain.address.repository.TrainRepository;
import com.ssafy.dawata.domain.appointment.dto.response.AppointmentPlaceResponse;
import com.ssafy.dawata.domain.common.service.S3Service;
import com.ssafy.dawata.domain.participant.entity.Participant;
import com.ssafy.dawata.domain.photo.repository.PhotoRepository;
import com.ssafy.dawata.domain.tmap.response.TransitResponse;
import com.ssafy.dawata.domain.tmap.service.TransitService;
import com.ssafy.dawata.global.util.GeoMidpointUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class RecommendService {

	private final TrainRepository trainRepository;
	private final TransitService transitService; // T맵 대중교통 API

	private final PhotoRepository photoRepository;
	private final S3Service s3Service;

	public Mono<double[]> getRecommendPlace(List<double[]> coordinates, String searchDttm) {
		// 참가자의 위도, 경도 평균 거리 계산
		double distance = GeoMidpointUtil.calculateAverageDistance(coordinates);

		// 2km 보다 작으면 단순 중간 지점 반환
		if (distance < 2000) {
			return Mono.just(GeoMidpointUtil.getSimpleMidPoint(coordinates));
		}

		// 필터링
		double[] latLngBounds = GeoMidpointUtil.getLatLngBounds(coordinates);
		List<Train> trains = new ArrayList<>(filterByDistance(
			trainRepository.findTrainByRange(
				latLngBounds[0], latLngBounds[1], latLngBounds[2], latLngBounds[3]
			),
			coordinates
		));

		trains.addAll(trainRepository.findMostPopularStations());

		return Flux.fromIterable(trains)
			.flatMap(train -> getTransitTimes(train, coordinates, searchDttm)
				.map(times -> new AbstractMap.SimpleEntry<>(train, times))
			)
			.filter(entry -> !entry.getValue().isEmpty()) // 응답이 없는 경우 제외
			.map(entry -> {
				double stdDev = calculateStdDev(entry.getValue());
				return new AbstractMap.SimpleEntry<>(entry.getKey(), stdDev);
			})
			.sort(Comparator.comparingDouble(AbstractMap.SimpleEntry::getValue)) // 표준편차가 최소인 순으로 정렬
			.next() // 최적의 역 하나만 선택
			.map(entry -> new double[] {entry.getKey().getLatitude(), entry.getKey().getLongitude()})
			.defaultIfEmpty(new double[2]); // 예외 처리 (추천 역이 없는 경우 빈 배열 반환)
	}

	public Mono<List<AppointmentPlaceResponse.ParticipantInfo>> getParticipantInfos(
		double[] destCoordinates,
		List<Participant> participants,
		Map<Long, URL> photoUrls,
		String searchDttm
	) {
		return Flux.fromIterable(participants)
			.flatMap(participant -> getTransit(
					new double[] {
						participant.getMemberAddressMapping().getAddress().getLatitude(),
						participant.getMemberAddressMapping().getAddress().getLongitude()
					},
					destCoordinates,
					searchDttm
				)
					.map(response -> {
						return AppointmentPlaceResponse.ParticipantInfo.of(
							participant.getClubMember().getMember().getId(),
							participant.getId(),
							participant.getClubMember().getNickname(),
							photoUrls.get(participant.getId()),
							participant.getMemberAddressMapping().getAddress().getLatitude(),
							participant.getMemberAddressMapping().getAddress().getLongitude(),
							response.getTotalTime(),
							response.getPaths()
						);
					})
			)
			.collectList()
			.map(participantInfos -> participantInfos.stream().filter(Objects::nonNull).collect(Collectors.toList()));
	}

	// -- 비지니스 로직 -- //
	// 비동기적으로 각 참가자의 대중교통 이동 시간을 요청하는 메서드
	private Mono<List<Integer>> getTransitTimes(Train train, List<double[]> coordinates, String searchDttm) {
		return Flux.fromIterable(coordinates)
			.flatMap(coordinate -> transitService.requestTransitSubAPI(
					coordinate[1],
					coordinate[0],
					train.getLongitude(),
					train.getLatitude(),
					searchDttm
				)
				.map(response -> response != null && response.getMetaData() != null ? response.getTotalTime() :
					0)
				.defaultIfEmpty(Integer.MAX_VALUE))
			.collectList()
			.map(times -> times.stream().filter(Objects::nonNull).collect(Collectors.toList())); // null 제거
	}

	private Mono<TransitResponse> getTransit(double[] start, double[] end, String searchDttm) {
		return Flux.just(start)
			.flatMap(coordinate -> transitService.requestTransitAPI(
					coordinate[1],
					coordinate[0],
					end[1],
					end[0],
					searchDttm
				)
			).defaultIfEmpty(new TransitResponse())
			.next();
	}

	// 표준 편차 계산 함수
	private static double calculateStdDev(List<Integer> times) {
		int size = times.size();
		double mean = times.stream().mapToDouble(a -> a).sum() / size;
		double variance = times.stream().mapToDouble(a -> Math.pow(a - mean, 2)).sum() / size;
		return Math.sqrt(variance);
	}

	// 거리 차이가 1km 이상인 경우 필터링
	private static List<Train> filterByDistance(List<Train> trains, List<double[]> coordinates) {
		List<Train> result = new ArrayList<>();
		for (Train train : trains) {
			boolean isFiltered = false;
			List<Double> distances = new ArrayList<>();
			for (double[] coordinate : coordinates) {
				double distance = GeoMidpointUtil.haversineDistance(
					new double[] {coordinate[0], coordinate[1]},
					new double[] {train.getLatitude(), train.getLongitude()}
				);
				if (distance < 1000) {
					isFiltered = true;
					break;
				}
				distances.add(distance);
			}

			if (isFiltered)
				continue;

			for (int i = 0; i < distances.size(); i++) {
				for (int j = i + 1; j < distances.size(); j++) {
					if (Math.abs(distances.get(i) - distances.get(j)) > 10000) {
						isFiltered = true;
						break;
					}
				}
				if (isFiltered)
					break;
			}

			if (!isFiltered) {
				result.add(train);
			}
		}
		return result;
	}
}
