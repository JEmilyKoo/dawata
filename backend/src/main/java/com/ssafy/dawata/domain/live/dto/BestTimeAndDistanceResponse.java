package com.ssafy.dawata.domain.live.dto;

import lombok.Builder;

@Builder
public record BestTimeAndDistanceResponse(
	int totalTime,
	int totalDistance
) {
}
