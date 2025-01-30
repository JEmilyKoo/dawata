package com.ssafy.dawata.domain.common.enums;

import lombok.Getter;

@Getter
public enum Role {
	HOST("호스트"),
	GUEST("게스트");

	private final String description;

	Role(String description) {
		this.description = description;
	}
}
