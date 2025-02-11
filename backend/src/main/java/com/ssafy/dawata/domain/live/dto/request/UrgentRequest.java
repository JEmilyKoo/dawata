package com.ssafy.dawata.domain.live.dto.request;

public record UrgentRequest(
	Long appointmentId,
	Long targetParticipantId
) {
}
