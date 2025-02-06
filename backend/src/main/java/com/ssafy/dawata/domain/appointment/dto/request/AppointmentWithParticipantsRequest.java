package com.ssafy.dawata.domain.appointment.dto.request;

import java.time.LocalDateTime;
import java.util.List;

import com.ssafy.dawata.domain.appointment.dto.AppointmentDto;
import com.ssafy.dawata.domain.common.enums.Category;

import io.swagger.v3.oas.annotations.media.Schema;

public record AppointmentWithParticipantsRequest(
	@Schema(description = "약속의 제목", example = "1월 17일 스터디")
	String name,

	@Schema(
		description = "약속의 카테고리 (고정 값들 중)",
		allowableValues = {"FRIEND", "STUDY", "HOBBY", "SOCIAL", "EXERCISE", "OTHER"},
		example = "STUDY"
	)
	Category category,

	@Schema(description = "약속 날짜와 시간", example = "2025-02-22T10:15:30")
	LocalDateTime scheduledAt,

	@Schema(description = "약속의 투표 마강 날짜와 시간", example = "2025-02-21T12:00:00")
	LocalDateTime voteEndTime,

	@Schema(description = "클럽 아이디", example = "1")
	Long clubId,

	@Schema(description = "참여할 멤버 아이디 리스트", example = "[1, 2, 3]")
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
