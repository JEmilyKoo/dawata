package com.ssafy.dawata.domain.auth.dto.response;

public record LoginResponse(
	String accessToken,
	String refreshToken,
	Long expiresIn,
	Boolean isInitial
) {
}
