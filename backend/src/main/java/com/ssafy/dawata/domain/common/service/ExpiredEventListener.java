package com.ssafy.dawata.domain.common.service;

import java.util.List;

import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.stereotype.Component;

import com.ssafy.dawata.domain.fcm.service.FCMService;
import com.ssafy.dawata.domain.member.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ExpiredEventListener implements MessageListener {
	private final FCMService fcmService;
	private final MemberRepository memberRepository;

	@Override
	public void onMessage(Message message, byte[] pattern) {
		String expiredKey = message.toString();

		handleExpiredKey(expiredKey);
	}

	//만료된 Key들로 분기처리
	private void handleExpiredKey(String expiredKey) {
		if (expiredKey.contains("live start :")) {
			liveStart(expiredKey);
		} else {
			throw new IllegalArgumentException("정해진 키가 아님둥~");
		}
	}

	// 라이브 시작 알림
	private void liveStart(String expiredKey) {
		Long id = Long.parseLong(expiredKey.substring(12));

		List<Long> l = memberRepository.customFindAllByAppointmentId(id);

		for (Long memberId : l) {
			fcmService.sendNotification("3", "3", id, memberId);
		}
	}
}
