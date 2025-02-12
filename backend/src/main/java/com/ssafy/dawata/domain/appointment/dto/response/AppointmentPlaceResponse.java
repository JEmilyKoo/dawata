package com.ssafy.dawata.domain.appointment.dto.response;

import java.net.URL;
import java.util.List;

public record AppointmentPlaceResponse(
	Double latitude,
	Double longitude,
	List<ParticipantInfo> participantInfo
) {

	public record ParticipantInfo(
		Long memberId,
		Long participantId,
		String nickname,
		String imageName,
		URL imageUrl,
		Integer duration
	) {

		public static ParticipantInfo of(
			Long memberId,
			Long participantId,
			String nickname,
			String imageName,
			URL imageUrl,
			Integer duration
		) {
			return new ParticipantInfo(memberId, participantId, nickname, imageName, imageUrl, duration);
		}
	}

	public static AppointmentPlaceResponse of(double latitude, double longitude,
		List<ParticipantInfo> participantInfo) {
		return new AppointmentPlaceResponse(latitude, longitude, participantInfo);
	}
}
