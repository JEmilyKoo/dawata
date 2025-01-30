package com.ssafy.dawata.domain.appointment.dto.request;

import java.time.LocalDateTime;
import java.util.List;

import com.ssafy.dawata.domain.appointment.dto.AppointmentDto;
import com.ssafy.dawata.domain.common.enums.Category;

public record AppointmentWithParticipantsRequest(
	String name,
	Category category,
	LocalDateTime scheduledAt,
	LocalDateTime voteEndTime,
	Long clubId,
	List<Long> memberIds
) {

	public AppointmentDto toDto() {
		return AppointmentDto.builder()
			.name(name)
			.category(category)
			.scheduledAt(scheduledAt)
			.voteEndTime(voteEndTime)
			.build();
	}
}
