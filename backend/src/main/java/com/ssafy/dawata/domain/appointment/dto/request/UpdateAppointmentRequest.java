package com.ssafy.dawata.domain.appointment.dto.request;

import java.time.LocalDateTime;
import java.util.Optional;

import com.ssafy.dawata.domain.common.enums.Category;

import lombok.Builder;

@Builder
public record UpdateAppointmentRequest(
	Optional<String> name,
	Optional<Category> category,
	Optional<LocalDateTime> scheduledAt,
	Optional<LocalDateTime> voteEndTime
) {
}
