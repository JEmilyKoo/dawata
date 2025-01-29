package com.ssafy.dawata.domain.routine.dto.request;

import com.ssafy.dawata.domain.routine.enums.PlayType;

public record RoutineElementRequest(
	PlayType play,
	Long spendTime
) {
}
