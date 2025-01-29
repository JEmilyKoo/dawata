package com.ssafy.dawata.domain.routine.dto.request;

import java.util.List;

public record RoutineRequest(
	String name,
	List<RoutineElementRequest> elementRequestList
) {
}
