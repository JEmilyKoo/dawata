package com.ssafy.dawata.domain.live.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.dawata.domain.auth.entity.SecurityMemberDetails;
import com.ssafy.dawata.domain.common.dto.ApiResponse;
import com.ssafy.dawata.domain.live.dto.request.UrgentRequest;
import com.ssafy.dawata.domain.live.service.LiveKitTokenService;
import com.ssafy.dawata.domain.live.service.LiveService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/live")
@RequiredArgsConstructor
public class LiveController {
	private final LiveService liveService;
	private final LiveKitTokenService liveKitTokenService;

	@Operation(summary = "현재 나의 live 조회",
		description = "현재 나의 live 조회하는 작업을 수행합니다.")
	@GetMapping
	public ResponseEntity<ApiResponse<?>> findLives(
		@AuthenticationPrincipal SecurityMemberDetails memberDetails
	) {
		return ResponseEntity.ok(
			ApiResponse.success(liveService.findLives(memberDetails.member().getId())));
	}

	@Operation(summary = "현재 내 live 상세조회",
		description = "현재 내 live 상세조회하는 작업을 수행합니다.")
	@GetMapping("/{appointmentId}")
	public ResponseEntity<ApiResponse<?>> findLiveDetail(
		@AuthenticationPrincipal SecurityMemberDetails memberDetails,
		@PathVariable("appointmentId") Long appointmentId) {
		return ResponseEntity.ok(
			ApiResponse.success(liveService.findLiveDetail(memberDetails.member().getId(), appointmentId)));
	}

	@Operation(summary = "현재 실행중인 내 루틴 조회",
		description = "현재 실행중인 내 루틴 조회를 수행합니다.")
	@GetMapping("/routine")
	public ResponseEntity<ApiResponse<?>> findMyRoutineInLive(
		@AuthenticationPrincipal SecurityMemberDetails memberDetails
	) {
		return ResponseEntity.ok(
			ApiResponse.success(liveService.findMyRoutineInLive(memberDetails.member().getId())));
	}

	@Operation(summary = "특정 멤버에게 재촉알림 보내기",
		description = "현재 나의 live 조회하는 작업을 수행합니다.")
	@PostMapping
	public ResponseEntity<ApiResponse<Void>> postUrgentNotification(
		@AuthenticationPrincipal SecurityMemberDetails memberDetails,
		@RequestBody UrgentRequest urgentRequest
	) {
		liveService.postUrgentNotification(memberDetails.member().getId(), urgentRequest);
		return ResponseEntity.ok(ApiResponse.success());
	}

	@Operation(summary = "화상 통화 토큰 발급", description = "화상 통화를 위한 토큰을 발급합니다.")
	@GetMapping("/{appointmentId}/token")
	public ResponseEntity<ApiResponse<String>> getLiveKitToken(
		@PathVariable Long appointmentId,
		@AuthenticationPrincipal SecurityMemberDetails memberDetails
	) {
		return ResponseEntity.ok(
			ApiResponse.success(
				liveKitTokenService.getLiveKitToken(
					appointmentId,
					memberDetails.member().getEmail()
				)
			)
		);
	}

}
