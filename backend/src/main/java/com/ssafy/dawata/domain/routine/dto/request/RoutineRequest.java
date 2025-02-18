package com.ssafy.dawata.domain.routine.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "루틴 request")
public record RoutineRequest(
    @Schema(description = "루틴 이름", example = "routine name")
    String routineName,
    @Schema(description = "루틴 행동 list")
    List<RoutineElementRequest> playList
) {

}
