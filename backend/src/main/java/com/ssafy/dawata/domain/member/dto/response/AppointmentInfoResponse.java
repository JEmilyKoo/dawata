package com.ssafy.dawata.domain.member.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "회원 출결 response 데이터")
public record AppointmentInfoResponse(
	@Schema(description = "그룹 PK Id", example = "1")
	Long clubId,
	@Schema(description = "그룹 이름", example = "club name")
	String clubName,
	@Schema(description = "총 약속 횟수", example = "3")
	Long totalCount,
	@Schema(description = "정상 출석 횟수", example = "1")
	Long appointmentTotalCount,
	@Schema(description = "지각 횟수", example = "1")
	Long lateTotalCount,
	@Schema(description = "노쇼 횟수", example = "1")
	Long onTimeAttendanceTotalCount
) {
}
