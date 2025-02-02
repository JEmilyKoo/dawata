package com.ssafy.dawata.domain.notice.dto.response;

import java.time.LocalDateTime;

import com.ssafy.dawata.domain.member.dto.response.MemberInfoResponse;

import lombok.Builder;

@Builder
public record NoticeResponse(
	Long id,
	String type,
	MemberInfoResponse memberInfoResponse,
	boolean read,
	LocalDateTime createdAt
) {
}
