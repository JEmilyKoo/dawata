package com.ssafy.dawata.domain.appointment.dto;

import java.time.LocalDateTime;

import com.ssafy.dawata.domain.appointment.entity.Appointment;
import com.ssafy.dawata.domain.common.enums.Category;

import lombok.Builder;

@Builder
public record AppointmentDto(
	Long id,
	String name,
	Category category,
	LocalDateTime scheduledAt,
	LocalDateTime voteEndTime
) {

	public Appointment toEntity() {
		return Appointment.createAppointment(name, category, scheduledAt, voteEndTime);
	}
}
