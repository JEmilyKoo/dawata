package com.ssafy.dawata.domain.live.dto.response;

import java.time.LocalDateTime;

import lombok.Builder;

@Builder
public record LiveRoutineResponse(
	Long routineId,
	LocalDateTime routineStartTime
) {
}
