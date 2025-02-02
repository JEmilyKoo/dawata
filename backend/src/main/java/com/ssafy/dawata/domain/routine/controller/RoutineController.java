package com.ssafy.dawata.domain.routine.controller;

import org.springframework.data.domain.Slice;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.dawata.domain.common.dto.ApiResponse;
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
	public ResponseEntity<ApiResponse<Slice<RoutineTemplateResponse>>> getRoutineList() {
		return ResponseEntity.ok(ApiResponse.success(routineService.findAllRoutines()));
	}

	@GetMapping("/{routineId}")
	public ResponseEntity<ApiResponse<RoutineDetailResponse>> getRoutine(@PathVariable("routineId") Long routineId) {
		return ResponseEntity.ok(ApiResponse.success(routineService.findRoutine(routineId)));
	}

	@PostMapping()
	public ResponseEntity<ApiResponse<Void>> createRoutine(@RequestBody RoutineRequest routineRequest) {
		routineService.saveRoutine(routineRequest);
		return ResponseEntity.ok(ApiResponse.success());
	}

	@PutMapping("/{routineId}")
	public ResponseEntity<ApiResponse<Void>> updateRoutine(
		@RequestBody RoutineRequest routineRequest,
		@PathVariable("routineId") Long routineId) {
		routineService.updateRoutine(routineId, routineRequest);
		return ResponseEntity.ok(ApiResponse.success());
	}

	@DeleteMapping("/{routineId}")
	public ResponseEntity<ApiResponse<Void>> deleteRoutine(
		@PathVariable("routineId") Long routineId) {
		routineService.deleteRoutine(routineId);
		return ResponseEntity.ok(ApiResponse.success());
	}
}
