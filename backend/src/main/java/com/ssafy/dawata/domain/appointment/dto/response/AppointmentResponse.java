package com.ssafy.dawata.domain.appointment.dto.response;

import java.time.LocalDateTime;

import com.ssafy.dawata.domain.appointment.entity.Appointment;
import com.ssafy.dawata.domain.common.enums.Category;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Schema(description = "약속 응답 스키마")
@Builder
public record AppointmentResponse(
	@Schema(description = "약속 아이디", example = "1")
	Long appointmentId,

	@Schema(description = "약속 이름", example = "회의")
	String name,

	@Schema(description = "카테고리", example = "MEETING")
	Category category,

	@Schema(description = "예정 시간", example = "2023-12-31T23:59:59")
	LocalDateTime scheduledAt,

	@Schema(description = "투표 종료 시간", example = "2023-12-31T23:59:59")
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
