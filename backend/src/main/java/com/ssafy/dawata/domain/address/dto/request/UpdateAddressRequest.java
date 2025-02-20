package com.ssafy.dawata.domain.address.dto.request;

import java.util.Optional;

public record UpdateAddressRequest(
	Optional<String> addressName,
	Optional<String> roadAddress,
	Optional<Double> latitude,
	Optional<Double> longitude,
	Optional<Boolean> isPrimary
) {
}
