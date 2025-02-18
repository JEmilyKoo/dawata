package com.ssafy.dawata.domain.notice.enums;

import java.util.Objects;

import lombok.Getter;

@Getter
public enum NoticeType {
	OTHERS(0),
	GROUP(1),
	VOTE(2),
	APPOINTMENT(3),
	LIVE(4),
	ROUTINE(5);

	private final int value;

	NoticeType(int value) {
		this.value = value;
	}
}
