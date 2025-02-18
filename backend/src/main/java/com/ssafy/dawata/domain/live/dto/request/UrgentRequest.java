package com.ssafy.dawata.domain.live.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "재촉을 위한 request")
public record UrgentRequest(
	@Schema(description = "약속 Id", example = "1")
	Long appointmentId,
	@Schema(description = "target하는 참가자 id", example = "1")
	Long targetParticipantId
) {
}
