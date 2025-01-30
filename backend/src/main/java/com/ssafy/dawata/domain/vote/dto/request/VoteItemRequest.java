package com.ssafy.dawata.domain.vote.dto.request;

import lombok.Builder;

/**
 * 투표 항목 생성 DTO
 */
@Builder
public record VoteItemRequest(
	String roadAddress,
	Double longitude,
	Double latitude,
	String title,
	String category,
	String detail,
	String linkUrl
) {

}
