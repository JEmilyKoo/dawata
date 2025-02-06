package com.ssafy.dawata.domain.appointment.dto.response;

import java.util.List;

import com.ssafy.dawata.domain.appointment.entity.Appointment;
import com.ssafy.dawata.domain.participant.entity.Participant;
import com.ssafy.dawata.domain.participant.enums.DailyStatus;
import com.ssafy.dawata.domain.vote.enums.VoteStatus;

import lombok.Builder;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "약속 리스트 조회용 스키마")
@Builder
public record AppointmentWithExtraInfoResponse(
	@Schema(description = "클럽 정보")
	ClubResponse clubInfo,

	@Schema(description = "약속 정보")
	AppointmentResponse appointmentInfo,

	@Schema(description = "참여자 정보 리스트")
	List<ParticipantResponse> participantInfos,

	@Schema(description = "투표 상태")
	VoteStatus voteStatus
) {

	@Schema(description = "클럽 응답 스키마")
	@Builder
	public record ClubResponse(
		@Schema(description = "클럽 아이디", example = "1")
		Long clubId,

		@Schema(description = "클럽 이름", example = "스터디 클럽")
		String name
	) {

		public static ClubResponse of(Long clubId, String name) {
			return ClubResponse.builder()
				.clubId(clubId)
				.name(name)
				.build();
		}
	}

	@Schema(description = "참여자 응답 스키마")
	@Builder
	public record ParticipantResponse(
		@Schema(description = "참여자 아이디", example = "1")
		Long participantId,

		@Schema(description = "참석 여부", example = "true")
		Boolean isAttending,

		@Schema(description = "출결 상태", example = "PRESENT")
		DailyStatus dailyStatus
	) {

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
		List<Participant> participants,
		VoteStatus voteStatus
	) {
		return AppointmentWithExtraInfoResponse.builder()
			.clubInfo(ClubResponse.of(clubId, clubName))
			.appointmentInfo(AppointmentResponse.of(appointment))
			.participantInfos(participants.stream().map(ParticipantResponse::of).toList())
			.voteStatus(voteStatus)
			.build();
	}
}
