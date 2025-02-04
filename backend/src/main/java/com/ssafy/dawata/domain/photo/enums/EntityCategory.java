package com.ssafy.dawata.domain.photo.enums;

import java.util.Arrays;
import java.util.Objects;

import com.ssafy.dawata.domain.participant.enums.DailyStatus;

import lombok.Getter;

@Getter
public enum EntityCategory {
	MEMBER(1),
	FEED(2),
	CLUB(3),
	CLUB_MEMBER(4),
	APPOINTMENT(5);

	private final Integer value;

	EntityCategory(int value) {
		this.value = value;
	}

	public Integer getValue() {
		return value;
	}

	public static EntityCategory fromValue(int value) {
		for (EntityCategory type : EntityCategory.values()) {
			if (Objects.equals(type.getValue(), value)) {
				return type;
			}
		}
		throw new IllegalArgumentException("Unknown value: " + value);
	}
}
