package com.ssafy.dawata.domain.photo.controller;

import java.net.URL;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.dawata.domain.common.dto.ApiResponse;
import com.ssafy.dawata.domain.photo.enums.EntityCategory;
import com.ssafy.dawata.domain.common.service.S3Service;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class S3Controller {

	private final S3Service s3Service;

	@Operation(summary = "이미지 작업 URL Get",
		description = "루틴을 생성하는 작업을 수행합니다.")
	@GetMapping("/photo/pre-signed-url")
	public ResponseEntity<ApiResponse<URL>> getPreSignedUrl(
		@Parameter(name = "fileName",
			description = "이미지 이름 (Get 요청시, 이미지 이름 필수)",
			example = "MEMBER_2025-02-03T18:55:40.170908700_userEmail.png")
		@RequestParam(value = "fileName", required = false) String fileName,
		@Parameter(name = "method",
			description = "실행할 메소드 (get, put, delete)", example = "get")
		@RequestParam(value = "method") String method,
		@Parameter(name = "entityCategory",
			description = "엔티티 type 지정", example = "MEMBER")
		@RequestParam(value = "entityCategory", required = false) EntityCategory entityCategory
	) {
		return ResponseEntity.ok(ApiResponse.success(s3Service.generatePresignedUrl(fileName, method, entityCategory)));
	}
}
