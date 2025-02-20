package com.ssafy.dawata.domain.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.dawata.domain.auth.dto.request.KakaoTokenRequest;
import com.ssafy.dawata.domain.auth.dto.response.LoginResponse;
import com.ssafy.dawata.domain.auth.service.KakaoOAuthService;
import com.ssafy.dawata.domain.common.dto.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

	private final KakaoOAuthService kakaoOAuthService;

	@PostMapping("/login/kakao")
	public ResponseEntity<ApiResponse<LoginResponse>> socialLogin(@RequestBody KakaoTokenRequest requestDto) {
		return ResponseEntity.ok(
			ApiResponse.success(
				kakaoOAuthService.socialLogin(requestDto.accessToken())
			)
		);
	}
}
