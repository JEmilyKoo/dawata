package com.ssafy.dawata.domain.member.dto.response;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Schema(description = "회원 response 데이터")
@Builder
public record MemberInfoResponse(
	@Schema(description = "이메일", example = "test@email.com")
	String email,
	@Schema(description = "이름", example = "userName")
	String name,
	@Schema(description = "이미지", example = "test.png")
	String img,
	@Schema(description = "생성 날짜", example = "2025-02-01T01:23:45")
	LocalDateTime createdAt
) {
}
