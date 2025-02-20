package com.ssafy.dawata.global.jwt;

import lombok.Builder;

@Builder
public record TokenDto(
	String grantType,
	String accessToken,
	String refreshToken,
	Long expiresIn
) {
}
