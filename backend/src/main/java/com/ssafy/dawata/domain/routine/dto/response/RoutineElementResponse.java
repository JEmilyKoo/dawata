package com.ssafy.dawata.domain.routine.dto.response;

import com.ssafy.dawata.domain.routine.enums.PlayType;

public record RoutineElementResponse(
	PlayType play,
	Long spendTime,
	boolean state
) {
}
