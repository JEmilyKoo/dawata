package com.ssafy.dawata.domain.common.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import com.ssafy.dawata.domain.address.entity.Address;
import com.ssafy.dawata.domain.address.repository.AddressRepository;
import com.ssafy.dawata.domain.appointment.entity.Appointment;
import com.ssafy.dawata.domain.appointment.repository.AppointmentRepository;
import com.ssafy.dawata.domain.appointment.service.AppointmentService;
import com.ssafy.dawata.domain.fcm.service.FCMService;
import com.ssafy.dawata.domain.live.dto.MemberLocationDto;
import com.ssafy.dawata.domain.live.enums.RedisKeyCategory;
import com.ssafy.dawata.domain.member.repository.MemberRepository;
import com.ssafy.dawata.domain.participant.repository.ParticipantRepository;
import com.ssafy.dawata.domain.vote.entity.VoteItem;
import com.ssafy.dawata.domain.vote.entity.Voter;
import com.ssafy.dawata.domain.vote.repository.VoteItemRepository;
import com.ssafy.dawata.domain.vote.repository.VoterRepository;

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

		// 약속 id + 목적지를 redis에 저장
		redisService.saveDataUseTTL(
			redisTemplateForOthers,
			RedisKeyCategory.VOTE_RESULT.getKey() + appointment.getId(),
			appointment.getScheduledAt() + "," +
				maxVoteItem.getAddress().getLatitude() + "," +
				maxVoteItem.getAddress().getLongitude(),
			A_DAY
		);
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
}
