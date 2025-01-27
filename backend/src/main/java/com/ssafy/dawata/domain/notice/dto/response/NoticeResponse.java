package com.ssafy.dawata.domain.notice.dto.response;

import java.time.LocalDateTime;

import com.ssafy.dawata.domain.member.entity.Member;

import lombok.Builder;

@Builder
public record NoticeResponse(
	Long id,
	String type,
	Member member,
	boolean read,
	boolean deleted,
	LocalDateTime createdAt
) {
}
