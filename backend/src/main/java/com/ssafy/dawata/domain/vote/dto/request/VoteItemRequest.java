package com.ssafy.dawata.domain.vote.dto.request;

import lombok.Builder;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "투표 항목 생성 요청 스키마")
@Builder
public record VoteItemRequest(
	@Schema(description = "도로명 주소", example = "서울특별시 강남구 테헤란로 427")
	String roadAddress,

	@Schema(description = "경도", example = "127.123456")
	Double longitude,

	@Schema(description = "위도", example = "37.123456")
	Double latitude,

	@Schema(description = "투표 항목 이름", example = "대우부대찌개")
	String title,

	@Schema(description = "투표 항목 카테고리", example = "찌개, 전골")
	String category,

	@Schema(description = "링크 URL", example = "http://example.com")
	String linkUrl
) {

}
