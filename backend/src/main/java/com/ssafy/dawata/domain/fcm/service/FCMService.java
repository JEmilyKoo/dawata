package com.ssafy.dawata.domain.fcm.service;

import java.util.Arrays;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.ssafy.dawata.domain.appointment.repository.AppointmentRepository;
import com.ssafy.dawata.domain.club.repository.ClubRepository;
import com.ssafy.dawata.domain.fcm.entity.FcmToken;
import com.ssafy.dawata.domain.fcm.enums.NoticeType;
import com.ssafy.dawata.domain.fcm.repository.FcmRepository;
import com.ssafy.dawata.domain.fcm.dto.request.FcmRequest;
import com.ssafy.dawata.domain.member.repository.MemberRepository;
import com.ssafy.dawata.domain.routine.repository.RoutineElementRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FCMService {
	private final ClubRepository clubRepository;
	private final AppointmentRepository appointmentRepository;
	private final MemberRepository memberRepository;
	private final RoutineElementRepository routineElementRepository;
	private final FcmRepository fcmRepository;

	@Transactional
	public void insertFcmToken(Long id, FcmRequest fcmRequest) {
		if (fcmRepository.findTokenUseMember(id) == null) {
			fcmRepository.save(FcmToken.createToken(fcmRequest.token()));
		}

		FcmToken fcmToken =
			fcmRepository.findById(id).orElseThrow(IllegalArgumentException::new);

		fcmToken.updateToken(fcmRequest.token());
	}

	public void sendNotification(String type, String messageType, Long entityId, Long memberId) {
		try {
			int typeCode = Integer.parseInt(type + messageType);

			Object[] messageValues = findMessageValue(typeCode, entityId, memberId);
			NoticeType noticeType =
				NoticeType.fromCodeToNoticeType(typeCode);

			// 메시지 생성
			Message message = Message.builder()
				.setToken(
					fcmRepository.findTokenUseMember(memberId))
				.setNotification(Notification.builder()
					.setTitle(noticeType.getTitle())
					.setBody(String.format(noticeType.getBody(), messageValues))
					.build())
				.build();

			// TODO(고) : notice db에 입력

			// 메시지 전송
			String response = FirebaseMessaging.getInstance().send(message);
			log.info("Successfully sent message: {}", response);
		} catch (FirebaseMessagingException e) {
			log.error("FCM 메시지 전송 실패: {}, ErrorCode: {}", e.getMessage(), e.getErrorCode(), e);
		} catch (Exception e) {
			log.error("예상치 못한 에러로 전송 실패: {}", e.getMessage(), e);
		}
	}

	private Object[] findMessageValue(int typeCode, Long entityId, Long memberId) {
		switch (typeCode / 10) {
			case 1, 2 -> {
				return Arrays.asList(
					clubRepository.findById(entityId)
						.orElseThrow(IllegalArgumentException::new).getName()
				).toArray();
			}
			case 3 -> {
				return Arrays.asList(
					appointmentRepository.findById(entityId)
						.orElseThrow(IllegalArgumentException::new).getName()
				).toArray();
			}
			case 4 -> {
				return Arrays.asList(
					memberRepository.findById(entityId)
						.orElseThrow(IllegalArgumentException::new).getName()
				).toArray();
			}
			case 5 -> {
				return Arrays.asList(
					memberRepository.findById(memberId)
						.orElseThrow(IllegalArgumentException::new).getName(),
					routineElementRepository.getReferenceById(entityId).getPlay()
				).toArray();
			}
		}

		throw new IllegalArgumentException("파라미터와 일치하는 데이터를 찾을 수 없습니다.");
	}
}
