package com.ssafy.dawata.domain.live.enums;

import lombok.Getter;

@Getter
public enum ExpiredKeyCategory {
	LIVE_START("live start :");

	final String key;

	ExpiredKeyCategory(String key) {
		this.key = key;
	}
}
