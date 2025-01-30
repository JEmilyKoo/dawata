package com.ssafy.dawata.domain.appointment.dto.request;

import java.time.LocalDateTime;

import com.ssafy.dawata.domain.appointment.dto.AppointmentDto;
import com.ssafy.dawata.domain.common.enums.Category;

public record AppointmentRequest(
	String name,
	Category category,
	LocalDateTime scheduledAt,
	LocalDateTime voteEndTime
) {
	
}
