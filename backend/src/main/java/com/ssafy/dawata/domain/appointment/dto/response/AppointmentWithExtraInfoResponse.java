package com.ssafy.dawata.domain.appointment.dto.response;

import java.util.List;

import com.ssafy.dawata.domain.appointment.entity.Appointment;
import com.ssafy.dawata.domain.participant.entity.Participant;
import com.ssafy.dawata.domain.participant.enums.DailyStatus;

import lombok.Builder;

@Builder
public record AppointmentWithExtraInfoResponse(
	ClubResponse clubInfo,
	AppointmentResponse appointmentInfo,
	List<ParticipantResponse> participantInfos
) {

	@Builder
	public record ClubResponse(Long clubId, String name) {

		public static ClubResponse of(Long clubId, String name) {
			return ClubResponse.builder()
				.clubId(clubId)
				.name(name)
				.build();
		}
	}

	@Builder
	public record ParticipantResponse(Long participantId, Boolean isAttending, DailyStatus dailyStatus) {

		public static ParticipantResponse of(Participant entity) {
			return ParticipantResponse.builder()
				.participantId(entity.getId())
				.isAttending(entity.getIsAttending())
				.dailyStatus(entity.getDailyStatus())
				.build();
		}
	}

	public static AppointmentWithExtraInfoResponse of(
		Long clubId,
		String clubName,
		Appointment appointment,
		List<Participant> participants
	) {
		return AppointmentWithExtraInfoResponse.builder()
			.clubInfo(ClubResponse.of(clubId, clubName))
			.appointmentInfo(AppointmentResponse.of(appointment))
			.participantInfos(participants.stream().map(ParticipantResponse::of).toList())
			.build();
	}
}
