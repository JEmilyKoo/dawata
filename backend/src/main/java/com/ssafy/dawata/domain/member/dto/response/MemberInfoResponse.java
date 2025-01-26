package com.ssafy.dawata.domain.member.dto.response;

import java.time.LocalDateTime;

import lombok.Builder;

@Builder
public record MemberInfoResponse(
	String email,
	String name,
	String img,
	LocalDateTime createdAt
) {
}
