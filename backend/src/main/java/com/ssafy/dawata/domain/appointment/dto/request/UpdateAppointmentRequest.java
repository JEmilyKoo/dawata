package com.ssafy.dawata.domain.appointment.dto.request;

import java.time.LocalDateTime;
import java.util.Optional;

import com.ssafy.dawata.domain.common.enums.Category;

import lombok.Builder;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "약속 수정 요청 스키마")
@Builder
public record UpdateAppointmentRequest(
	@Schema(
		description = "약속의 제목",
		example = "1월 17일 스터디",
		requiredMode = Schema.RequiredMode.NOT_REQUIRED,
		nullable = true
	)
	Optional<String> name,

	@Schema(
		description = "약속의 카테고리 (고정 값들 중)",
		allowableValues = {"FRIEND", "STUDY", "HOBBY", "SOCIAL", "EXERCISE", "OTHER"},
		example = "STUDY",
		requiredMode = Schema.RequiredMode.NOT_REQUIRED,
		nullable = true
	)
	Optional<Category> category,

	@Schema(
		description = "약속 날짜와 시간",
		example = "2025-02-22T10:15:30",
		requiredMode = Schema.RequiredMode.NOT_REQUIRED,
		nullable = true
	)
	Optional<LocalDateTime> scheduledAt,

	@Schema(
		description = "약속의 투표 마감 날짜와 시간",
		example = "2025-02-21T12:00:00",
		requiredMode = Schema.RequiredMode.NOT_REQUIRED,
		nullable = true
	)
	Optional<LocalDateTime> voteEndTime
) {
}
