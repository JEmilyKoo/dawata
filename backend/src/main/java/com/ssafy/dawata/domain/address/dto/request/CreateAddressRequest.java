package com.ssafy.dawata.domain.address.dto.request;

public record CreateAddressRequest(
	String addressName,
	String roadAddress,
	double latitude,
	double longitude

) {

}
