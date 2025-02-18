package com.ssafy.dawata.domain.member.dto.request;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "사진 수정 request")
public record MemberPhotoRequest(
	@Schema(description = "이미지 이름 (Get 요청시, 이미지 이름 필수)",
		example = "MEMBER_2025-02-03T18:55:40.170908700_userEmail.png")
	String fileName
) {
}
