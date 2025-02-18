package com.ssafy.dawata.domain.live.dto.request;

import lombok.Builder;

@Builder
public record TMapRequest(
	Double startX,
	Double startY,
	Double endX,
	Double endY
) {
}
