package com.ssafy.dawata.domain.routine.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "루틴 요소 request")
public record RoutineElementRequest(
	@Schema(description = "루틴 행동 이름", example = "밥먹기")
	String play,
	@Schema(description = "소요 예상 시간", example = "20")
	Long spendTime
) {
}
