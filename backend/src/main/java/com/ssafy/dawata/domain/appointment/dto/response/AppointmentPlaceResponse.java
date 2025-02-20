package com.ssafy.dawata.domain.appointment.dto.response;

import java.net.URL;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "추천 약속 장소 응답")
public record AppointmentPlaceResponse(
	@Schema(description = "장소의 위도")
	Double latitude,
	@Schema(description = "장소의 경도")
	Double longitude,
	@Schema(description = "참가자 정보 목록")
	List<ParticipantInfo> participantInfo
) {

	@Schema(description = "참가자 정보")
	public record ParticipantInfo(
		@Schema(description = "회원 ID")
		Long memberId,
		@Schema(description = "참가자 ID")
		Long participantId,
		@Schema(description = "참가자 닉네임")
		String nickname,
		@Schema(description = "참가자 이미지 URL")
		URL img,
		@Schema(description = "참가자 위도")
		Double latitude,
		@Schema(description = "참가자 경도")
		Double longitude,
		@Schema(description = "소요 시간(분)")
		int duration,
		@Schema(description = "참가자가 이동한 경로")
		List<String> paths
	) {

		public static ParticipantInfo of(
			Long memberId,
			Long participantId,
			String nickname,
			URL img,
			Double latitude,
			Double longitude,
			int duration,
			List<String> paths
		) {
			return new ParticipantInfo(
				memberId, participantId, nickname, img, latitude, longitude, duration, paths
			);
		}
	}

	public static AppointmentPlaceResponse of(double latitude, double longitude,
		List<ParticipantInfo> participantInfo) {
		return new AppointmentPlaceResponse(latitude, longitude, participantInfo);
	}
}
