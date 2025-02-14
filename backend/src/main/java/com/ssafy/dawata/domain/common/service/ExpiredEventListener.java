package com.ssafy.dawata.domain.common.service;

import java.time.LocalDateTime;
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
import com.ssafy.dawata.domain.live.dto.MemberLocationDto;
import com.ssafy.dawata.domain.live.enums.RedisKeyCategory;
import com.ssafy.dawata.domain.live.service.SkOpenApiService;
import com.ssafy.dawata.domain.member.repository.MemberRepository;
import com.ssafy.dawata.domain.vote.entity.VoteItem;
import com.ssafy.dawata.domain.vote.repository.VoteItemRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ExpiredEventListener implements MessageListener {
	private final FCMService fcmService;
	private final MemberRepository memberRepository;
	private final VoteItemRepository voteItemRepository;
	private final AppointmentRepository appointmentRepository;

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
		/*
		 * TODO(고)
		 * 	1. 루틴관련 조건 추가
		 * 	2. 그 루틴 key -> memberId, appointmentId, routineElementId
		 * 	3. memberId key를 가지고 있는 redis에서 value를 가져오고 appointmentId랑 같은 지 파악
		 * 	4. 같으면 fcm, 다르면 끝
		 * */

		if (expiredKey.contains(RedisKeyCategory.LIVE_START.getKey())) {
			liveStart(expiredKey);
		} else if (expiredKey.contains(RedisKeyCategory.APPOINTMENT_VOTE.getKey())) {
			voteFinish(expiredKey);
		} else {
			throw new IllegalArgumentException("정해진 키가 아닙니다.");
		}
	}

	// 약속의 투표 만료 -> 정해진 목적지 Get
	private void voteFinish(String expiredKey) {
		Long appointmentId = Long.parseLong(
			expiredKey.substring(
				RedisKeyCategory.APPOINTMENT_VOTE.getLen()
			)
		);

		Appointment appointment = appointmentRepository.findById(appointmentId)
			.orElseThrow(() -> new IllegalArgumentException("해당하는 약속이 없습니다."));

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

		Double lat = voteItemRepository.findMaxCountByAppointmentId(appointmentId)
			.get(0).getAddress().getLatitude();

		Double lnt = voteItemRepository.findMaxCountByAppointmentId(appointmentId)
			.get(0).getAddress().getLongitude();

		// 약속 id + 목적지를 redis에 저장
		redisService.saveDataUseTTL(
			redisTemplateForOthers,
			RedisKeyCategory.VOTE_RESULT.getKey() + appointment.getId(),
			appointment.getScheduledAt() + "," +
				maxVoteItem.getAddress().getLatitude() + "," +
				maxVoteItem.getAddress().getLongitude(),
			A_DAY
		);

		List<MemberLocationDto> memberLocationList =
			memberRepository.customFindAllByAppointmentId(appointmentId);

		List<Long> memberIdList = memberLocationList
			.stream()
			.map(MemberLocationDto::memberId)
			.toList();

		for (Long memberId : memberIdList) {
			//현재 appointmentId로 Appointment Get
			Appointment appointmentInExpiredEvent = appointmentRepository.findById(appointmentId)
				.orElseThrow(() -> new IllegalArgumentException("해당 약속은 존재하지 않습니다."));

			//현재 redis에 루틴 설정이 되어있는 지 파악
			if (redisService.isExists(
				redisTemplateForOthers,
				RedisKeyCategory.ROUTINE.getKey() + memberId)
			) {

				//Redis Get으로 이전의 저장되어 있던 appointmentId Get
				Long appointmentIdInRedis =
					objectMapper.convertValue(
						redisService.getData(
							redisTemplateForOthers,
							RedisKeyCategory.ROUTINE.getKey() + memberId
						),
						new TypeReference<Long>() {
						}
					);

				//Redis에 있던 appointmentId로 Appointment Get
				Appointment appointmentInRedisId = appointmentRepository.findById(appointmentIdInRedis)
					.orElseThrow(() -> new IllegalArgumentException("해당 약속은 존재하지 않습니다."));

				// 여기서부터 시작
				// TODO : 스케쥴 - now - 예상 루틴 시간
				// - 음수 : 루틴을 순서대로 저장을 하지만 시간이 오버가 되면 error
				// - 양수 : 이게 호출 시, 루틴을 순서대로 시간에 맞게 저장

				// 가장 가까운 일정의 약속을 저장
				if (!isAfter(appointmentInExpiredEvent, appointmentInRedisId)) {
					redisService.updateDataUseTTL(
						redisTemplateForOthers,
						RedisKeyCategory.ROUTINE.getKey() + memberId,
						String.valueOf(appointmentId),
						redisService.getExpirationTime(
							appointmentInExpiredEvent.getScheduledAt(),
							LocalDateTime.now()
						)
					);
				}
			} else {
				//현재 redis에 루틴 설정이 안되있으니 그냥 저장
				redisService.saveDataUseTTL(
					redisTemplateForOthers,
					RedisKeyCategory.ROUTINE.getKey() + memberId,
					String.valueOf(appointmentId),
					redisService.getExpirationTime(
						appointmentInExpiredEvent.getScheduledAt(),
						LocalDateTime.now()
					)
				);
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

			// (각 user location) redis에 나의 데이터를 apointmentId + memberId로 저장
			redisService.saveDataUseTTL(
				redisTemplateForLiveLocation,
				String.format(RedisKeyCategory.LIVE_LOCATION.getKey(),
					new Object[] {id, memberLocationDto.memberId()}),
				memberLocationDto.latitude() + "," + memberLocationDto.longitude(),
				A_DAY
			);

			// fcm으로 시작 알림 전송
			fcmService.sendNotification(
				"3",
				"3",
				id,
				memberLocationDto.memberId());
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
	 * */
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
}
