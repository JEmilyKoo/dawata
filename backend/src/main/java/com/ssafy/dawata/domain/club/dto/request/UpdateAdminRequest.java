package com.ssafy.dawata.domain.club.dto.request;

public record UpdateAdminRequest(
	Long clubId,
	Long currentAdminId,
	Long newAdminId

) {
}
