package com.ssafy.dawata.domain.routine.dto.response;

public record RoutineElementResponse(
	Long id,
	String play,
	Long spendTime,
	boolean state
) {
}
