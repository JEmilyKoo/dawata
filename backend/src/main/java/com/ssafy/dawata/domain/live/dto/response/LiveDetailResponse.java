package com.ssafy.dawata.domain.live.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Builder
@Schema(description = "live 초기 연결 데이터 Response")
public record LiveDetailResponse(
	@Schema(description = "약속 장소 lat 좌표", example = "37.427709")
	Double latitude,
	@Schema(description = "약속 장소 lnt 좌표", example = "127.154037")
	Double longitude,
	@Schema(description = "약속 시간", example = "2024-09-16T02:12:14")
	LocalDateTime appointmentTime,
	@Schema(description = "약속 오는 사람", example = "2024-09-16T02:12:14")
	List<LiveParticipantResponse> participants
) {
}
