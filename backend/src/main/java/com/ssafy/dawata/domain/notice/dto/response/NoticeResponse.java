package com.ssafy.dawata.domain.notice.dto.response;

import java.time.LocalDateTime;

import com.ssafy.dawata.domain.member.dto.response.MemberInfoResponse;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Builder
@Schema(description = "알림 request")
public record NoticeResponse(
	@Schema(description = "알림 PK Id", example = "1")
	Long id,
	@Schema(description = "알림 type", example = "11")
	String type,
	// @Schema(description = "회원 response 데이터")
	// MemberInfoResponse memberInfoResponse,
	@Schema(description = "알림 읽음 유무", example = "false")
	boolean read,
	@Schema(description = "알림 생성 날짜", example = "2025-02-01T01:23:45")
	LocalDateTime createdAt,
	@Schema(description = "알림 문장", example = "~~함")
	String str
) {
}
