package com.ssafy.dawata.domain.appointment.dto.response;

import java.util.List;

import com.ssafy.dawata.domain.appointment.entity.Appointment;
import com.ssafy.dawata.domain.common.enums.Role;
import com.ssafy.dawata.domain.participant.entity.Participant;
import com.ssafy.dawata.domain.participant.enums.DailyStatus;
import com.ssafy.dawata.domain.vote.entity.VoteItem;

import lombok.Builder;

@Builder
public record AppointmentDetailResponse(
	ClubResponse clubInfo,
	AppointmentResponse appointmentInfo,
	List<ParticipantResponse> participantInfos,
	List<VoteResponse> voteInfos
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
	public record ParticipantResponse(
		Long participantId,
		Boolean isAttending,
		DailyStatus dailyStatus,
		Role role,
		String img
	) {

		public static ParticipantResponse of(Participant entity, String img) {
			return ParticipantResponse.builder()
				.participantId(entity.getId())
				.isAttending(entity.getIsAttending())
				.dailyStatus(entity.getDailyStatus())
				.role(entity.getRole())
				.img(img)
				.build();
		}
	}

	@Builder
	public record VoteResponse(
		String title,
		String category,
		String detail,
		String linkUrl,
		String roadAddress,
		Double latitude,
		Double longitude,
		Boolean isSelected,
		Double percentage
	) {

		public static VoteResponse of(VoteItem entity, boolean isSelected, double percentage) {
			return VoteResponse.builder()
				.title(entity.getTitle())
				.category(entity.getCategory())
				.detail(entity.getDetail())
				.linkUrl(entity.getLinkUrl())
				.roadAddress(entity.getAddress().getRoadAddress())
				.latitude(entity.getAddress().getLatitude())
				.longitude(entity.getAddress().getLongitude())
				.isSelected(isSelected)
				.percentage(percentage)
				.build();
		}
	}

	public static AppointmentDetailResponse of(
		Long clubId,
		String clubName,
		Appointment appointment,
		List<ParticipantResponse> participantResponses,
		List<VoteResponse> voteInfos
	) {
		return AppointmentDetailResponse.builder()
			.clubInfo(ClubResponse.of(clubId, clubName))
			.appointmentInfo(AppointmentResponse.of(appointment))
			.participantInfos(participantResponses)
			.voteInfos(voteInfos)
			.build();
	}
}
