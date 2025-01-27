package com.ssafy.dawata.domain.notice.enums;

import java.util.Objects;

import lombok.Getter;

@Getter
public enum NoticeType {
	GROUP(1L),
	VOTE(2L),
	APPOINTMENT(3L),
	LIVE(4L),
	ROUTINE(5L);

	private final Long value;

	NoticeType(Long value) {
		this.value = value;
	}

	public Long getValue() {
		return value;
	}

	public static NoticeType fromValue(Long value) {
		for (NoticeType type : NoticeType.values()) {
			if (Objects.equals(type.getValue(), value)) {
				return type;
			}
		}
		throw new IllegalArgumentException("Unknown value: " + value);
	}
}
