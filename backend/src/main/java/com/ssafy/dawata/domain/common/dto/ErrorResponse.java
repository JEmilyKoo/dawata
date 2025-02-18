package com.ssafy.dawata.domain.common.dto;

import org.springframework.http.ResponseEntity;

import com.ssafy.dawata.domain.common.error.ErrorCodeInterface;

import lombok.Builder;

@Builder
public record ErrorResponse(
	int status,
	String errorResponseCode,
	String message
) {
	public static <T extends ErrorCodeInterface> ErrorResponse from(T errorCode) {
		return ErrorResponse.builder()
			.status(errorCode.getStatus().value())
			.errorResponseCode(errorCode.getErrorResponseCode())
			.message(errorCode.getMessage())
			.build();
	}

	public static <T extends ErrorCodeInterface> ResponseEntity<ErrorResponse> toResponseEntity(T errorCode) {
		return ResponseEntity
			.status(errorCode.getStatus())
			.body(ErrorResponse.from(errorCode));
	}
}
