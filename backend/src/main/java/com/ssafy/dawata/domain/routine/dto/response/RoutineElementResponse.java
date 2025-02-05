package com.ssafy.dawata.domain.routine.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "루틴 행동 response")
public record RoutineElementResponse(
	@Schema(description = "루틴 해동 PK Id", example = "1")
	Long id,
	@Schema(description = "루틴 행동 이름", example = "밥먹기")
	String play,
	@Schema(description = "소요 시간", example = "20")
	Long spendTime,
	@Schema(description = "사용 유무", example = "true")
	boolean state
) {
}
