package com.ssafy.dawata.domain.routine.dto.request;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "루틴 request")
public record RoutineRequest(
	@Schema(description = "루틴 이름", example = "routine name")
	String name,
	@Schema(description = "루틴 행동 list")
	List<RoutineElementRequest> elementRequestList
) {
}
