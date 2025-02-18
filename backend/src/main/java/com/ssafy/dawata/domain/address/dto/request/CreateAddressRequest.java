package com.ssafy.dawata.domain.address.dto.request;

public record CreateAddressRequest(
	String addressName,
	String roadAddress,
	Double latitude,
	Double longitude,
	Boolean isPrimary

) {
}
