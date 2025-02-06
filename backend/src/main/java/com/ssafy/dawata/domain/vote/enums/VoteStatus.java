package com.ssafy.dawata.domain.vote.enums;

import lombok.Getter;

@Getter
public enum VoteStatus {
	NOT_PARTICIPANT(0),
	EXPIRED(1),
	SELECTED(2),
	NOT_SELECTED(3);

	private final int code;

	VoteStatus(int code) {
		this.code = code;
	}
}
