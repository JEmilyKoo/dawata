package com.ssafy.dawata.domain.live.dto.request;

public record LiveRequest(
	Long memberId,
	Double latitude,
	Double longitude
) {
}
