package com.ssafy.dawata.domain.routine.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "루틴 행동 response")
public record RoutineElementResponse(
    @Schema(description = "루틴 행동 PK Id", example = "1")
    Long playId,
    @Schema(description = "루틴 행동 이름", example = "밥먹기")
    String playName,
    @Schema(description = "소요 시간", example = "20")
    Long spendTime
) {

}
