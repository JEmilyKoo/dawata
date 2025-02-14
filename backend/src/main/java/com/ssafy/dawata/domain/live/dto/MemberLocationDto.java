package com.ssafy.dawata.domain.live.dto;

public record MemberLocationDto(
	Long memberId,
	Double latitude,
	Double longitude
) {
}
