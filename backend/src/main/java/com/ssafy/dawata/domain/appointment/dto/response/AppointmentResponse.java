package com.ssafy.dawata.domain.appointment.dto.response;

import java.time.LocalDateTime;

import com.ssafy.dawata.domain.appointment.entity.Appointment;
import com.ssafy.dawata.domain.common.enums.Category;

import lombok.Builder;

@Builder
public record AppointmentResponse(
	Long appointmentId,
	String name,
	Category category,
	LocalDateTime scheduledAt,
	LocalDateTime voteEndTime
) {

	public static AppointmentResponse of(Appointment entity) {
		return AppointmentResponse.builder()
			.appointmentId(entity.getId())
			.name(entity.getName())
			.category(entity.getCategory())
			.scheduledAt(entity.getScheduledAt())
			.voteEndTime(entity.getVoteEndTime())
			.build();
	}
}
