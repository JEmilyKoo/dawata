package com.ssafy.dawata.domain.routine.dto.response;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Schema(description = "변경할 이름")
@Builder
public record RoutineDetailResponse(
	@Schema(description = "루틴 이름", example = "routine name")
	String name,
	@Schema(description = "루틴 행동 list")
	List<RoutineElementResponse> routineTemplateList
) {
}
