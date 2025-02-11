package com.ssafy.dawata.domain.live.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.dawata.domain.auth.entity.SecurityMemberDetails;
import com.ssafy.dawata.domain.common.dto.ApiResponse;
import com.ssafy.dawata.domain.live.service.LiveService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/live")
@RequiredArgsConstructor
public class LiveController {
	private final LiveService liveService;

	@Operation(summary = "현재 나의 live 조회",
		description = "현재 나의 live 조회하는 작업을 수행합니다.")
	@GetMapping
	public ResponseEntity<ApiResponse<?>> findLives(
		@AuthenticationPrincipal SecurityMemberDetails memberDetails
	) {
		return ResponseEntity.ok(
			ApiResponse.success(liveService.findLives(memberDetails.member().getId())));
	}
}
