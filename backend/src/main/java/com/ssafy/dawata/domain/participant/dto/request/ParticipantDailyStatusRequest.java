package com.ssafy.dawata.domain.participant.dto.request;

import com.ssafy.dawata.domain.participant.enums.DailyStatus;

public record ParticipantDailyStatusRequest(
	DailyStatus dailyStatus
) {
}
