package com.ssafy.dawata.domain.common.dto;

public record ApiResponse<T>(
	String status,
	T data
) {
	public static <T> ApiResponse<T> success(T data) {
		return new ApiResponse<>("success", data);
	}

	public static <T> ApiResponse<T> success() {
		return new ApiResponse<>("success", null);
	}
}
