package com.ssafy.dawata.domain.routine.controller;

import org.springframework.data.domain.Slice;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.dawata.domain.auth.entity.SecurityMemberDetails;
import com.ssafy.dawata.domain.common.dto.ApiResponse;
import com.ssafy.dawata.domain.routine.dto.request.RoutineRequest;
import com.ssafy.dawata.domain.routine.dto.response.RoutineDetailResponse;
import com.ssafy.dawata.domain.routine.dto.response.RoutineTemplateResponse;
import com.ssafy.dawata.domain.routine.service.RoutineService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/routines")
@RequiredArgsConstructor
public class RoutineController {
	private final RoutineService routineService;

	@Operation(summary = "내 모든 루틴 조회",
		description = "내 모든 루틴을 조회하는 작업을 수행합니다.")
	@GetMapping
	public ResponseEntity<ApiResponse<Slice<RoutineTemplateResponse>>> getRoutineList(
		@AuthenticationPrincipal SecurityMemberDetails memberDetails
	) {
		return ResponseEntity.ok(
			ApiResponse.success(
				routineService.findAllRoutines(memberDetails.member().getId())
			)
		);
	}

	@Operation(summary = "특정 루틴 조회",
		description = "특정 루틴을 조회하는 작업을 수행합니다.")
	@GetMapping("/{routineId}")
	public ResponseEntity<ApiResponse<RoutineDetailResponse>> getRoutine(
		@AuthenticationPrincipal SecurityMemberDetails memberDetails,
		@Parameter(description = "루틴 ID", example = "1")
		@PathVariable("routineId") Long routineId
	) {
		return ResponseEntity.ok(
			ApiResponse.success(
				routineService.findRoutine(
					memberDetails.member().getId(),
					routineId)
			)
		);
	}

	@Operation(summary = "루틴 생성",
		description = "루틴을 생성하는 작업을 수행합니다.")
	@PostMapping()
	public ResponseEntity<ApiResponse<Void>> createRoutine(
		@AuthenticationPrincipal SecurityMemberDetails memberDetails,
		@RequestBody RoutineRequest routineRequest
	) {
		routineService.saveRoutine(memberDetails.member().getId(), routineRequest);
		return ResponseEntity.ok(ApiResponse.success());
	}

	@Operation(summary = "루틴 수정",
		description = "루틴을 수정하는 작업을 수행합니다.")
	@PutMapping("/{routineId}")
	public ResponseEntity<ApiResponse<Void>> updateRoutine(
		@AuthenticationPrincipal SecurityMemberDetails memberDetails,
		@RequestBody RoutineRequest routineRequest,
		@Parameter(description = "루틴 ID", example = "1")
		@PathVariable("routineId") Long routineId
	) {
		routineService.updateRoutine(memberDetails.member().getId(), routineId, routineRequest);
		return ResponseEntity.ok(ApiResponse.success());
	}

	@Operation(summary = "루틴 삭제",
		description = "루틴을 삭제하는 작업을 수행합니다.")
	@DeleteMapping("/{routineId}")
	public ResponseEntity<ApiResponse<Void>> deleteRoutine(
		@AuthenticationPrincipal SecurityMemberDetails memberDetails,
		@Parameter(description = "루틴 ID", example = "1")
		@PathVariable("routineId") Long routineId
	) {
		routineService.deleteRoutine(memberDetails.member().getId(), routineId);
		return ResponseEntity.ok(ApiResponse.success());
	}

	//TODO(고) : 루틴 알람 설정 on / off
}
