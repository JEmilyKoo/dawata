package com.ssafy.dawata.domain.routine.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "변경할 이름")
public record RoutineTemplateResponse(
	@Schema(description = "루틴 PK Id", example = "1")
	Long id,
	@Schema(description = "루틴 이름", example = "약속 전 루틴")
	String name,
	@Schema(description = "루틴 총 소요시간")
	Long totalTime
) {
}
