package com.ssafy.dawata.domain.common.service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.dawata.domain.appointment.entity.Appointment;
import com.ssafy.dawata.domain.appointment.repository.AppointmentRepository;
import com.ssafy.dawata.domain.fcm.service.FCMService;
import com.ssafy.dawata.domain.live.dto.BestTimeAndDistanceResponse;
import com.ssafy.dawata.domain.live.dto.MemberLocationDto;
import com.ssafy.dawata.domain.live.enums.RedisKeyCategory;
import com.ssafy.dawata.domain.live.service.SkOpenApiService;
import com.ssafy.dawata.domain.member.repository.MemberRepository;
import com.ssafy.dawata.domain.participant.entity.Participant;
import com.ssafy.dawata.domain.participant.repository.ParticipantRepository;
import com.ssafy.dawata.domain.routine.entity.RoutineElement;
import com.ssafy.dawata.domain.routine.repository.RoutineElementRepository;
import com.ssafy.dawata.domain.vote.entity.VoteItem;
import com.ssafy.dawata.domain.vote.repository.VoteItemRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class ExpiredEventListener implements MessageListener {
	private final FCMService fcmService;
	private final MemberRepository memberRepository;
	private final VoteItemRepository voteItemRepository;
	private final AppointmentRepository appointmentRepository;
	private final ParticipantRepository participantRepository;
	private final RoutineElementRepository routineElementRepository;

	private final RedisTemplate<String, Object> redisTemplateForLiveLocation;
	private final RedisTemplate<String, String> redisTemplateForOthers;
	private final RedisService redisService;
	private final SkOpenApiService skOpenApiService;

	private final ObjectMapper objectMapper;

	private final int A_DAY = 60 * 60 * 24;

	@Override
	public void onMessage(Message message, byte[] pattern) {
		String expiredKey = message.toString();

		handleExpiredKey(expiredKey);
	}

	//만료된 Key들로 분기처리
	private void handleExpiredKey(String expiredKey) {
		if (expiredKey.contains(RedisKeyCategory.LIVE_START.getKey())) {
			liveStart(expiredKey);
		} else if (expiredKey.contains(RedisKeyCategory.APPOINTMENT_VOTE.getKey())) {
			voteFinish(expiredKey);
		} else if (expiredKey.contains(RedisKeyCategory.ROUTINE_ELEMENT_FINISH.getKey())) {
			sendRoutineFCM(expiredKey);
		} else {
			throw new IllegalArgumentException("정해진 키가 아닙니다.");
		}
	}

	private void sendRoutineFCM(String expiredKey) {
		String[] idList =
			expiredKey.substring(
				RedisKeyCategory.ROUTINE_ELEMENT_FINISH.getLen()
			).split(",");

		Long memberId = Long.parseLong(idList[0]);
		Long appointmentId = Long.parseLong(idList[1]);
		Long routineElementId = Long.parseLong(idList[2]);

		Long wantAppointmentId =
			Long.parseLong(redisService.getData(
					redisTemplateForOthers,
					RedisKeyCategory.ROUTINE.getKey() + memberId
				)
			);

		if (appointmentId.equals(wantAppointmentId)) {
			fcmService.sendNotification("5", "1", routineElementId, memberId);
		}
	}

	// 약속의 투표 만료 -> 정해진 목적지 Get
	private void voteFinish(String expiredKey) {
		//만료 키에서 약속 id를 가져옴
		Long appointmentId = Long.parseLong(
			expiredKey.substring(
				RedisKeyCategory.APPOINTMENT_VOTE.getLen()
			)
		);

		//약속 id에 맞는 약속 찾기
		Appointment appointment = appointmentRepository.findById(appointmentId)
			.orElseThrow(() -> new IllegalArgumentException("해당하는 약속이 없습니다."));

		//약속에서 가장 많은 득표 수를 찾기
		//동률이면 idx가 빠른 걸로
		VoteItem maxVoteItem = voteItemRepository.findMaxCountByAppointmentId(appointmentId)
			.stream()
			.max(Comparator.comparingInt(v -> v.getVoters().size()))
			.orElse(null);

		//2시간 내면 바로 시작, 아니면 만료 세팅
		if (LocalDateTime.now()
			.isAfter(appointment.getScheduledAt().minusHours(2))) {
			liveStart(RedisKeyCategory.LIVE_START.getKey() + appointmentId);
		} else {
			redisService.saveDataUseTTL(
				redisTemplateForOthers,
				RedisKeyCategory.LIVE_START.getKey() + appointment.getId(),
				"",
				redisService.getExpirationTime(appointment.getScheduledAt().minusHours(2), LocalDateTime.now())
			);
		}

		// 약속 id + 목적지를 redis에 저장
		redisService.saveDataUseTTL(
			redisTemplateForOthers,
			RedisKeyCategory.VOTE_RESULT.getKey() + appointment.getId(),
			appointment.getScheduledAt() + "," +
				maxVoteItem.getAddress().getLatitude() + "," +
				maxVoteItem.getAddress().getLongitude(),
			A_DAY
		);

		//해당 약속 id에 속해있는 참가자의 member 정보를 List로 Set
		List<MemberLocationDto> memberLocationList =
			memberRepository.customFindAllByAppointmentId(appointmentId);

		// 각 사용자마다 지금 약속 위치 저장 및 가장 최근 약속의 루틴으로 redis 데이터 저장
		for (MemberLocationDto memberLocationDto : memberLocationList) {
			if (redisService.isExists(
				redisTemplateForOthers,
				RedisKeyCategory.ROUTINE.getKey() + memberLocationDto.memberId()
			)) {
				//Redis Get으로 이전의 저장되어 있던 appointmentId Get
				Long appointmentIdInRedis =
					transObject(
						memberLocationDto.memberId(),
						RedisKeyCategory.ROUTINE,
						new TypeReference<Long>() {
						}
					);

				//Redis에 있던 appointmentId로 Appointment Get
				Appointment appointmentInRedisId = appointmentRepository.findById(appointmentIdInRedis)
					.orElseThrow(() -> new IllegalArgumentException("해당 약속은 존재하지 않습니다."));

				// 가장 가까운 일정의 약속을 저장
				if (!isAfter(appointment, appointmentInRedisId)) {
					redisService.updateDataUseTTL(
						redisTemplateForOthers,
						RedisKeyCategory.ROUTINE.getKey() + memberLocationDto.memberId(),
						String.valueOf(appointmentId),
						redisService.getExpirationTime(
							appointment.getScheduledAt(),
							LocalDateTime.now()
						)
					);
				}
			} else {
				//현재 redis에 루틴 설정이 안되있으니 그냥 저장
				redisService.saveDataUseTTL(
					redisTemplateForOthers,
					RedisKeyCategory.ROUTINE.getKey() + memberLocationDto.memberId(),
					String.valueOf(appointmentId),
					redisService.getExpirationTime(
						appointment.getScheduledAt(),
						LocalDateTime.now()
					)
				);
			}

			// (각 user location) redis에 나의 데이터를 apointmentId + memberId로 저장
			redisService.saveDataUseTTL(
				redisTemplateForLiveLocation,
				String.format(RedisKeyCategory.LIVE_LOCATION.getKey(),
					new Object[] {appointmentId, memberLocationDto.memberId()}),
				memberLocationDto.latitude() + "," + memberLocationDto.longitude(),
				A_DAY
			);

			try {
				//목적지 위치
				VoteItem voteItem =
					voteItemRepository
						.findMaxCountByAppointmentId(appointmentId)
						.get(0);

				BestTimeAndDistanceResponse bestApiResponse = skOpenApiService.getBestApiResponse(
					memberLocationDto.latitude(),
					memberLocationDto.longitude(),
					voteItem.getAddress().getLatitude(),
					voteItem.getAddress().getLongitude()
				);

				// 이제 현재 시간이랑 스케쥴에서 내 출발 예정시간이랑 비교하고 해당 루틴마다 redis를 만들기
				LocalDateTime finishRoutineTime = null;
				if (bestApiResponse.totalDistance() != -1 && bestApiResponse.totalTime() != -1) {
					finishRoutineTime =
						appointmentRepository.findById(appointmentId)
							.orElseThrow(() -> new IllegalArgumentException("해당하는 약속이 없습니다."))
							.getScheduledAt().minusSeconds(bestApiResponse.totalTime());
				}

				// 해당 약속에 설정한 루틴 요소들을 Get
				Participant participant =
					participantRepository.findByMemberIdAndAppointmentId(memberLocationDto.memberId(), appointmentId)
						.orElseGet(null);

				setRedisForRoutine(memberLocationDto, participant, finishRoutineTime, appointmentId);
			} catch (Exception e) {
				throw new RuntimeException(e);
			}
		}
	}

	// 해당 루틴 redis에 저장 -> 날짜 비교로 알맞게 세팅
	private void setRedisForRoutine(MemberLocationDto memberLocationDto, Participant participant,
		LocalDateTime finishRoutineTime, Long appointmentId) {
		if (participant != null) {
			List<RoutineElement> routineElementList =
				routineElementRepository.findAllByRoutineTemplateId(participant.getRoutineTemplateId());

			int totalSpendTime = 0;
			for (int routineIdx = routineElementList.size() - 1; routineIdx >= 0; routineIdx--) {
				RoutineElement routineElement = routineElementList.get(routineIdx);

				totalSpendTime += routineElement.getSpendTime();
				if (LocalDateTime.now().isBefore(finishRoutineTime)
					&& finishRoutineTime.isBefore(LocalDateTime.now().plusMinutes(totalSpendTime))
				) {
					redisService.saveDataUseTTL(
						redisTemplateForOthers,
						getRoutineKey(memberLocationDto, appointmentId, routineElement),
						"",
						LocalDateTime.now().plusMinutes(totalSpendTime).minusSeconds(
								finishRoutineTime.atZone(ZoneId.systemDefault()).toEpochSecond())
							.atZone(ZoneId.systemDefault()).toEpochSecond()
					);
				} else if (LocalDateTime.now().isBefore(finishRoutineTime)
					&& finishRoutineTime.isAfter(LocalDateTime.now().plusMinutes(totalSpendTime))
				) {
					redisService.saveDataUseTTL(
						redisTemplateForOthers,
						getRoutineKey(memberLocationDto, appointmentId, routineElement),
						"",
						finishRoutineTime.minusMinutes(totalSpendTime)
							.minusSeconds(LocalDateTime.now().atZone(ZoneId.systemDefault()).toEpochSecond())
							.atZone(ZoneId.systemDefault()).toEpochSecond()
					);
				}
			}
		}
	}

	// 라이브 시작 알림 + 설정
	private void liveStart(String expiredKey) {
		//key에서 id get
		Long id = Long.parseLong(
			expiredKey.substring(
				RedisKeyCategory.LIVE_START.getLen()
			)
		);

		//해당 약속의 참가자들의 Data
		List<MemberLocationDto> memberLocationList =
			memberRepository.customFindAllByAppointmentId(id);
		List<Long> totalParticipantIdList = new ArrayList<>();

		//해당 약속의 모든 memberId List
		for (MemberLocationDto memberLocationDto : memberLocationList) {
			totalParticipantIdList.add(memberLocationDto.memberId());

			// fcm으로 시작 알림 전송
			fcmService.sendNotification(
				"3",
				"3",
				id,
				memberLocationDto.memberId()
			);
		}

		//(참가장 id List) redis에 약속을 Key, 해당 약속의 모든 참여자들을 List로 저장
		redisService.saveDataUseTTL(
			redisTemplateForLiveLocation,
			RedisKeyCategory.LIVE_PARTICIPANT_LIST.getKey() + id,
			totalParticipantIdList,
			A_DAY * 2
		);
	}

	/**
	 * appointment로 가까운 약속찾는 로직
	 * true -> 뒤이 가까움
	 * false -> 앞이 가까움
	 */
	private boolean isAfter(Appointment appointmentInExpiredEvent, Appointment appointmentInRedisId) {
		LocalDateTime now = LocalDateTime.now();

		if (appointmentInExpiredEvent.getScheduledAt().isAfter(now) && appointmentInRedisId.getScheduledAt()
			.isAfter(now)) {
			return appointmentInExpiredEvent.getScheduledAt().isAfter(appointmentInRedisId.getScheduledAt());
		} else if (appointmentInExpiredEvent.getScheduledAt().isAfter(now)) {
			return false;
		} else if (appointmentInRedisId.getScheduledAt().isAfter(now)) {
			return true;
		} else {
			throw new IllegalArgumentException("두 약속 모두 일정이 지났습니다.");
		}
	}

	private <T> T transObject(Object keyValue, RedisKeyCategory redisKeyCategory, TypeReference<T> typeReference) {
		return objectMapper.convertValue(
			redisService.getData(
				redisTemplateForOthers,
				redisKeyCategory.getKey() + keyValue
			),
			typeReference
		);
	}

	private static String getRoutineKey(MemberLocationDto memberLocationDto, Long appointmentId,
		RoutineElement routineElement) {
		return RedisKeyCategory.ROUTINE_ELEMENT_FINISH.getKey() +
			memberLocationDto.memberId() + "," + appointmentId + "," + routineElement.getId();
	}
}
