package com.ssafy.dawata.domain.participant.enums;

import java.util.Arrays;
import java.util.Objects;

import lombok.Getter;

@Getter
public enum DailyStatus {
	PRESENT("정상", "P"),
	LATE("지각", "L"),
	NO_SHOW("노쇼", "NS");

	private final String description;

	private final String code;

	DailyStatus(String description, String code) {
		this.description = description;
		this.code = code;
	}

	public static DailyStatus of(String code) {
		return Arrays.stream(DailyStatus.values())
			.filter(v -> Objects.equals(v.getCode(), code))
			.findAny()
			.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 출결 상태입니다."));
	}
}
