package com.ssafy.dawata.domain.member.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "이름 변경 request")
public record MemberInfoUpdateRequest(
	@Schema(description = "변경할 이름", example = "userName")
	String name
) {
}
