package com.ssafy.dawata.domain.live.dto;

import lombok.Builder;

@Builder
public record LiveIdsDto(
	Long memberId,
	Long participantId
) {
}
