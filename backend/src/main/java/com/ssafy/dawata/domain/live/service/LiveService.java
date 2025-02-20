package com.ssafy.dawata.domain.live.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.dawata.domain.appointment.entity.Appointment;
import com.ssafy.dawata.domain.appointment.repository.AppointmentRepository;
import com.ssafy.dawata.domain.club.repository.ClubMemberRepository;
import com.ssafy.dawata.domain.common.service.RedisService;
import com.ssafy.dawata.domain.common.service.S3Service;
import com.ssafy.dawata.domain.fcm.service.FCMService;
import com.ssafy.dawata.domain.live.dto.BestTimeAndDistanceResponse;
import com.ssafy.dawata.domain.live.dto.MemberLocationDto;
import com.ssafy.dawata.domain.live.dto.ParticipantDto;
import com.ssafy.dawata.domain.live.dto.request.UrgentRequest;
import com.ssafy.dawata.domain.live.dto.response.LiveDetailResponse;
import com.ssafy.dawata.domain.live.dto.response.LiveParticipantResponse;
import com.ssafy.dawata.domain.live.dto.response.LiveRoutineResponse;
import com.ssafy.dawata.domain.live.enums.ArrivalState;
import com.ssafy.dawata.domain.live.enums.RedisKeyCategory;
import com.ssafy.dawata.domain.member.repository.MemberRepository;
import com.ssafy.dawata.domain.participant.repository.ParticipantRepository;
import com.ssafy.dawata.domain.photo.enums.EntityCategory;
import com.ssafy.dawata.domain.routine.entity.RoutineElement;
import com.ssafy.dawata.domain.routine.entity.RoutineTemplate;
import com.ssafy.dawata.domain.routine.repository.RoutineTemplateRepository;
import com.ssafy.dawata.domain.vote.entity.VoteItem;
import com.ssafy.dawata.domain.vote.repository.VoteItemRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class LiveService {
	private final ClubMemberRepository clubMemberRepository;
	private final AppointmentRepository appointmentRepository;
	private final MemberRepository memberRepository;
	private final VoteItemRepository voteItemRepository;

	private final FCMService fcmService;
	private final S3Service s3Service;

	private final RedisTemplate<String, Object> redisTemplateForLiveLocation;
	private final RedisTemplate<String, String> redisTemplateForOthers;
	private final RedisService redisService;

	private final SkOpenApiService skOpenApiService;

	private final ObjectMapper objectMapper;
	private final ParticipantRepository participantRepository;
	private final RoutineTemplateRepository routineTemplateRepository;

	public Long findLives(Long memberId) {
		LocalDateTime now = LocalDateTime.now();

		/**
		 * 지금부터 2시간 후까지 존재여부 Check
		 * */
		List<Long> liveList = appointmentRepository.findByScheduledAtInTwoHours(
			memberId,
			now,
			now.plusHours(2)
		);

		return liveList.isEmpty() ? 0 : liveList.get(0);
	}

	/**
	 * 재촉기능
	 */
	public void postUrgentNotification(Long memberId, UrgentRequest urgentRequest) {
		// 재촉알림 fcm
		fcmService.sendNotification(
			"4",
			"2",
			memberId,
			urgentRequest.targetParticipantId());
	}

	/**
	 * Live기능 Detail
	 */
	public LiveDetailResponse findLiveDetail(Long id, Long appointmentId) {
		List<Long> memberList =
			objectMapper.convertValue(
				redisService.getData(
					redisTemplateForLiveLocation,
					RedisKeyCategory.LIVE_PARTICIPANT_LIST.getKey() + appointmentId),
				new TypeReference<List<Long>>() {
				}
			);
		String[] arrivals = redisService.getData(
			redisTemplateForOthers,
			RedisKeyCategory.VOTE_RESULT.getKey() + appointmentId
		).split(",");

		List<LiveParticipantResponse> participantResponseList = new ArrayList<>();

		for (Long memberId : memberList) {
			ParticipantDto participantDto =
				clubMemberRepository.findByMemberIdToParticipantDto(appointmentId, memberId)
					.orElseThrow(() -> new IllegalArgumentException("참여자가 없습니다."));

			// 위치 2개
			String[] locationArray =
				objectMapper.convertValue(
					redisService.getData(
						redisTemplateForLiveLocation,
						String.format(
							RedisKeyCategory.LIVE_LOCATION.getKey(),
							new Object[] {appointmentId, memberId}
						)
					),
					new TypeReference<String>() {
					}
				).split(",");

			// t map에 길찾기 요청 (걷는 기준)
			try {
				BestTimeAndDistanceResponse bestApiResponse = skOpenApiService.getBestApiResponse(
					Double.parseDouble(locationArray[0]),
					Double.parseDouble(locationArray[1]),
					Double.parseDouble(arrivals[1]),
					Double.parseDouble(arrivals[2])
				);

				if (bestApiResponse.totalDistance() != -1 && bestApiResponse.totalTime() != -1) {
					//리스트에 추가
					participantResponseList.add(
						LiveParticipantResponse.toResponse(
							participantDto,
							//이미지
							s3Service.generatePresignedUrl(
								participantDto.fileName(),
								"GET",
								EntityCategory.CLUB_MEMBER,
								participantDto.clubMember().getId()
							).toString(),
							Double.parseDouble(locationArray[0]),
							Double.parseDouble(locationArray[1]),
							bestApiResponse.totalDistance() < 100 ?
								ArrivalState.ARRIVED :
								ArrivalState.NOT_ARRIVED,
							bestApiResponse.totalTime()
						)
					);
				} else {
					throw new IllegalArgumentException("데이터를 전달할 수 없습니다.");
				}
			} catch (Exception e) {
				throw new IllegalArgumentException("try 중 에러가 났어요");
			}
		}

		//Redis에서 목적지 가져오기
		String[] latLnt = redisService.getData(
			redisTemplateForOthers,
			RedisKeyCategory.VOTE_RESULT.getKey() + appointmentId
		).split(",");

		return LiveDetailResponse.builder()
			.appointmentTime(LocalDateTime.parse(latLnt[0]))
			.latitude(Double.parseDouble(latLnt[1]))
			.longitude(Double.parseDouble(latLnt[2]))
			.participants(participantResponseList)
			.build();
	}

	public LiveRoutineResponse findMyRoutineInLive(Long memberId) {
		Long appointmentId = findLives(memberId);

		VoteItem maxVoteItem =
			voteItemRepository.findMaxCountByAppointmentId(appointmentId)
				.stream()
				.max(Comparator.comparingInt(v -> v.getVoters().size()))
				.orElse(null);

		if (appointmentId == 0 || maxVoteItem == null) {
			return null;
		}

		Appointment appointment = appointmentRepository.findById(appointmentId)
			.orElseThrow(() -> new IllegalArgumentException("참가하는 약속이 없습니다."));

		MemberLocationDto memberLocationDto =
			memberRepository.customFindByAppointmentIdAndMemberId(appointmentId, memberId)
				.orElseThrow(() -> new IllegalArgumentException("해당하는 참여자의 위치가 없"));

		try {
			BestTimeAndDistanceResponse bestApiResponse = skOpenApiService.getBestApiResponse(
				memberLocationDto.latitude(),
				memberLocationDto.longitude(),
				maxVoteItem.getAddress().getLatitude(),
				maxVoteItem.getAddress().getLongitude()
			);

			Long routineTemplateId = participantRepository.findByMemberIdAndAppointmentId(memberId, appointmentId)
				.orElseThrow(() -> new IllegalArgumentException("조건에 맞는 참여자가 없습니다."))
				.getRoutineTemplateId();

			List<RoutineTemplate> routineTemplateList = routineTemplateRepository.findAllByMember(
				memberRepository.findById(memberId)
					.orElseThrow(() -> new IllegalArgumentException("멤버 없음")));
			RoutineTemplate routineTemplate = routineTemplateList.stream()
				.filter(x -> x.getId() == routineTemplateId)
				.findFirst().orElse(null);

			if (routineTemplate == null) {
				return null;
			}

			LocalDateTime l = appointment.getScheduledAt()
				.minusSeconds(
					bestApiResponse.totalTime())
				.minusMinutes(
					routineTemplate.getRoutineElements()
						.stream()
						.map(RoutineElement::getSpendTime)
						.mapToLong(x -> x).sum()
				);

			return LiveRoutineResponse.builder()
				.routineId(memberId)
				.routineStartTime(
					LocalDateTime.of(
						l.getYear(), l.getMonth(), l.getDayOfMonth(),
						l.getHour(), l.getMinute(), 00)
				)
				.build();
		} catch (Exception e) {
			throw new IllegalArgumentException("T map error");
		}
	}
}
