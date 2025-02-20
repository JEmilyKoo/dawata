package com.ssafy.dawata.domain.appointment.dto.request;

import lombok.Builder;

public record UpdateAppointmentHostRequest(
	Long clubId,
	OriginHost oriHost,
	NewHost newHost
) {
	public record OriginHost(
		Long memberId,
		Long participantId
	) {
	}

	public record NewHost(
		Long memberId,
		Long participantId
	) {
	}
}
