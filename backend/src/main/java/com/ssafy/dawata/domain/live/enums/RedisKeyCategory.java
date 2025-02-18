package com.ssafy.dawata.domain.live.enums;

import lombok.Getter;

@Getter
public enum RedisKeyCategory {
	LIVE_START("live start :", 12),
	LIVE_LOCATION("appointmentId : %d | participantId : %d", Integer.MAX_VALUE),
	LIVE_PARTICIPANT_LIST("total participant id List : ", 28),
	APPOINTMENT_VOTE("appointment vote :", 18),
	VOTE_RESULT("vote result :", 13),
	ROUTINE("routine :", 9),
	ROUTINE_ELEMENT_FINISH("routine finish -> memberId, appointmentId, routineElementId :", 61);

	final String key;
	final int len;

	RedisKeyCategory(String key, int len) {
		this.key = key;
		this.len = len;
	}
}
