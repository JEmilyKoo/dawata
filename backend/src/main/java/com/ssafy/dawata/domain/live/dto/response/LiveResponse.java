package com.ssafy.dawata.domain.live.dto.response;

import com.ssafy.dawata.domain.live.dto.request.LiveRequest;
import com.ssafy.dawata.domain.live.enums.ArrivalState;

import lombok.Builder;

@Builder
public record LiveResponse(
	Long memberId,
	Double latitude,
	Double longitude,
	ArrivalState arrivalState,
	int estimatedTime
) {

	public static LiveResponse of(
		LiveRequest liveRequest,
		ArrivalState arrivalState,
		int estimatedTime
	) {
		return LiveResponse.builder()
			.memberId(liveRequest.memberId())
			.latitude(liveRequest.latitude())
			.longitude(liveRequest.longitude())
			.arrivalState(arrivalState)
			.estimatedTime(estimatedTime)
			.build();
	}
}
