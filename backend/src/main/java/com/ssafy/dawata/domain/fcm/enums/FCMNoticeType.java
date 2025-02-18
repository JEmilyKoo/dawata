package com.ssafy.dawata.domain.fcm.enums;

import lombok.Getter;

@Getter
public enum FCMNoticeType {
	GROUP_INVITE(11, "그룹", "%s에 초대되었습니다."),
	GROUP_CREATE_APPOINTMENT(12, "그룹", "%s에서 약속이 생성되었습니다."),
	GROUP_PARTICIPATION_APPOINTMENT(13, "그룹", "%s 약속에 참여되었습니다."),
	VOTE_UPDATE(21, "투표", "%s에서 투표가 변경되었습니다."),
	VOTE_END(22, "투표", "%s에서 투표가 마감되었습니다."),
	APPOINTMENT_HISTORY_NOTICE(31, "약속", "약속 알림~"), // 요건 fe과 상의필요
	APPOINTMENT_UPDATE(32, "약속", "%s 약속이 변경되었습니다."),
	LIVE_START(33, "약속", "%s live가 시작 되었습니다."),
	LIVE_OTHER_ARRIVED(41, "라이브", "%s님이 목적지에 도착했습니다."),
	LIVE_HURRY_UP_NOTICE(42, "라이브", "%s님이 재촉하고 있습니다."),
	LIVE_VIDEO_TELEPHONY(43, "라이브", "%s님이 화상통화를 걸었습니다."),
	ROUTINE_NOTICE(51, "루틴", "%s님, %s할 시간입니다.");

	private final int code;
	private final String title;
	private final String body;

	FCMNoticeType(int code, String title, String body) {
		this.code = code;
		this.title = title;
		this.body = body;
	}

	//숫자 -> name으로
	public static FCMNoticeType fromCodeToNoticeType(int code) {
		for (FCMNoticeType category : FCMNoticeType.values()) {
			if (code == category.getCode()) {
				return category;
			}
		}
		throw new IllegalArgumentException("카테고리 코드 오류");
	}
}
