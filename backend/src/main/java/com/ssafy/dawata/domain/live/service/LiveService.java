package com.ssafy.dawata.domain.live.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.dawata.domain.appointment.repository.AppointmentRepository;
import com.ssafy.dawata.domain.fcm.service.FCMService;
import com.ssafy.dawata.domain.live.dto.request.UrgentRequest;
import com.ssafy.dawata.domain.member.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LiveService {
	private final AppointmentRepository appointmentRepository;
	private final MemberRepository memberRepository;
	private final FCMService fcmService;

	public List<Long> findLives(Long memberId) {
		LocalDateTime now = LocalDateTime.now();

		return appointmentRepository.findByScheduledAtInTwoHours(
			memberId,
			now,
			now.plusHours(2)
		);
	}

	public void postUrgentNotification(Long memberId, UrgentRequest urgentRequest) {
		/*
		*  TODO(고) :
		*   1. memberId가 어디 pk인지
		* 		- member
		* 		- club_member
		* 		- participant (이거 예상)
		* */
		
		fcmService.sendNotification(
			"4",
			"3",
			memberId,
			memberRepository
				.customFindByParticipantId(urgentRequest.targetParticipantId())
				.orElseThrow(() -> new IllegalArgumentException("해당하는 약속 참가자가 없음둥~")));
	}
}
