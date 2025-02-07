package com.ssafy.dawata.domain.member.dto.response;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "yyyy-mm에 해당 하는 약속 출력 response")
public record AppointmentInMonthResponse(
	@Schema(description = "약속 이름", example = "약속 name")
	String appointmentName,
	@Schema(description = "그룹 이름", example = "그룹 name")
	String clubName,
	@Schema(description = "약속 날짜 + 시간", example = "2026-02-07T18:20:59")
	LocalDateTime scheduledAt,
	@Schema(description = "투표 마감 시간", example = "2026-02-07T18:20:59")
	LocalDateTime voteEndTime
) {
}
