package com.ssafy.dawata.domain.photo.controller;

import java.net.URL;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.dawata.domain.photo.enums.EntityCategory;
import com.ssafy.dawata.domain.common.service.S3Service;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class S3Controller {

	private final S3Service s3Service;

	@GetMapping("/photo/pre-signed-url")
	public ResponseEntity<URL> getPreSignedUrl(
		@RequestParam(value = "fileName", required = false) String fileName,
		@RequestParam(value = "method") String method,
		@RequestParam(value = "entityCategory", required = false) EntityCategory entityCategory
	) {
		return ResponseEntity.ok(s3Service.generatePresignedUrl(fileName, method, entityCategory));
	}
}
