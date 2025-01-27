package com.ssafy.dawata.domain.club.dto.request;

public record UpdateAdminRequest(
	Long currentAdminId,
	Long newAdminId
) {
}
