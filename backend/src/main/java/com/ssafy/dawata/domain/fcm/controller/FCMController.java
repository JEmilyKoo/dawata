package com.ssafy.dawata.domain.fcm.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.dawata.domain.auth.entity.SecurityMemberDetails;
import com.ssafy.dawata.domain.common.dto.ApiResponse;
import com.ssafy.dawata.domain.fcm.service.FCMService;
import com.ssafy.dawata.domain.fcm.dto.request.FcmRequest;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/fcm")
@RequiredArgsConstructor
public class FCMController {
	private final FCMService fcmService;

	@Operation(summary = "내 Device에 fcmToken 설정",
		description = "내 Device에 fcmToken 설정하는 작업을 수행합니다.")
	@PostMapping()
	public ResponseEntity<ApiResponse<Void>> insertToken(
		@AuthenticationPrincipal SecurityMemberDetails memberDetails,
		@RequestBody FcmRequest fcmRequest) {
		fcmService.insertFcmToken(memberDetails.member().getId(), fcmRequest);
		return ResponseEntity.ok(ApiResponse.success());
	}
}
