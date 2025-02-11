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
		/* TODO(고) : 만료시간이 오면 key값으로 해당 역할로 진행
		    1. 투표 완료
		    	1.1. 약속 시간 2시간 전 시간까지로 만료시간 지정
		    	1.2. 만료 이벤트 발생 시, live 관련 알림 제공
		    		-> 메인갈 때마다 front가 확인한 번씩 해야할 듯?
		    		-> live관련 정보 제공하는 api 필요
		*/
		String expiredKey = message.toString();

		handleExpiredKey(expiredKey);
	}

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
