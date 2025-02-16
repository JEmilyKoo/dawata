package com.ssafy.dawata.domain.recommend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.dawata.domain.address.entity.Train;
import com.ssafy.dawata.domain.address.repository.TrainRepository;
import com.ssafy.dawata.domain.tmap.response.TransitResponse;
import com.ssafy.dawata.domain.tmap.service.TransitService;
import com.ssafy.dawata.global.util.GeoMidpointUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class RecommendService {

	private final TrainRepository trainRepository;
	private final TransitService transitService; // T맵 대중교통 API

	public double[] getRecommendPlace(List<double[]> coordinates, String searchDttm) {
		// 참가자의 위도, 경도 평균 거리 계산
		double distance = GeoMidpointUtil.calculateAverageDistance(coordinates);

		// 2km 보다 작으면 단순 중간 지점 반환
		if (distance < 2000) {
			return GeoMidpointUtil.getSimpleMidPoint(coordinates);
		}

		// 필터링
		double[] latLngBounds = GeoMidpointUtil.getLatLngBounds(coordinates);
		List<Train> trains = filterByDistance(
			trainRepository.findTrainByRange(
				latLngBounds[0],
				latLngBounds[1],
				latLngBounds[2],
				latLngBounds[3]),
			coordinates
		);

		trains.addAll(trainRepository.findMostPopularStations());

		// 가장 합리적인 역 찾기
		double minStdDev = Double.MAX_VALUE;
		double[] result = new double[2];

		for (Train train : trains) {
			List<Integer> times = new ArrayList<>();
			boolean flag = false;
			for (double[] coordinate : coordinates) {
				TransitResponse response = transitService.requestTransitSubAPI(
					String.valueOf(coordinate[1]),
					String.valueOf(coordinate[0]),
					String.valueOf(train.getLongitude()),
					String.valueOf(train.getLatitude()),
					searchDttm
				).block();

				if (response == null || response.getMetaData() == null) {
					flag = true;
					break;
				}
				times.add(response.getTotalTime());
			}
			
			if (flag)
				continue;

			double stdDev = calculateStdDev(times);
			if (stdDev < minStdDev) {
				minStdDev = stdDev;
				result = new double[] {train.getLatitude(), train.getLongitude()};
			}
		}

		// TODO: 최종적으로는 legs까지 반환하는게 좋을 것 같음

		return result;
	}

	// 표준 편차 계산 함수
	private static double calculateStdDev(List<Integer> times) {
		int size = times.size();
		double mean = times.stream().mapToDouble(a -> a).sum() / size;
		double variance = times.stream().mapToDouble(a -> Math.pow(a - mean, 2)).sum() / size;
		return Math.sqrt(variance);
	}

	// 거리 차이가 10km 이상인 경우 필터링
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
				if (distance < 10000) {
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
