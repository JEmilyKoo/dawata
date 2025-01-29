package com.ssafy.dawata.domain.routine.controller;

import org.springframework.data.domain.Slice;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.dawata.domain.routine.dto.request.RoutineRequest;
import com.ssafy.dawata.domain.routine.dto.response.RoutineDetailResponse;
import com.ssafy.dawata.domain.routine.dto.response.RoutineTemplateResponse;
import com.ssafy.dawata.domain.routine.service.RoutineService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/routines")
@RequiredArgsConstructor
public class RoutineController {
	private final RoutineService routineService;

	@GetMapping
	public Slice<RoutineTemplateResponse> getRoutineList() {
		return routineService.findAllRoutines();
	}

	@GetMapping("/{routineId}")
	public RoutineDetailResponse getRoutine(@PathVariable("routineId") Long routineId) {
		return routineService.findRoutine(routineId);
	}

	@PostMapping()
	public boolean createRoutine(@RequestBody RoutineRequest routineRequest) {
		return routineService.saveRoutine(routineRequest);
	}
}
