package com.ssafy.dawata.domain.member.dto.response;

public record AppointmentInfoResponse(
	// TODO : appointmentList는 약속 구현 후 추가 예정
	int groupTotalCount,
	int appointmentTotalCount,
	int lateTotalCount,
	int onTimeAttendanceTotalCount
) {
}
