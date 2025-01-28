package com.ssafy.dawata.domain.routine.dto.response;

import java.util.List;

import lombok.Builder;

@Builder
public record RoutineDetailResponse(
	String name,
	List<RoutineElementResponse> routineTemplateList
) {
}
