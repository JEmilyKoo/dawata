package com.ssafy.dawata.domain.appointment.dto.response;

import java.net.URL;
import java.util.List;

import com.ssafy.dawata.domain.appointment.entity.Appointment;
import com.ssafy.dawata.domain.common.enums.Role;
import com.ssafy.dawata.domain.participant.entity.Participant;
import com.ssafy.dawata.domain.participant.enums.DailyStatus;
import com.ssafy.dawata.domain.vote.entity.VoteItem;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Schema(description = "약속 상세 응답 스키마")
@Builder
public record AppointmentDetailResponse(
	@Schema(description = "클럽 정보")
	ClubResponse clubInfo,

	@Schema(description = "약속 정보")
	AppointmentResponse appointmentInfo,

	@Schema(description = "참여자 정보 리스트")
	List<ParticipantResponse> participantInfos,

	@Schema(description = "투표 정보 리스트")
	List<VoteResponse> voteInfos,

	@Schema(description = "나의 루틴 id")
	Long routineId
) {

	@Schema(description = "클럽 응답 스키마")
	@Builder
	public record ClubResponse(
		@Schema(description = "클럽 아이디", example = "1")
		Long clubId,

		@Schema(description = "클럽 이름", example = "스터디 클럽")
		String name,

		@Schema(description = "이미지 pre-signed url", example = "http://example.com")
		URL img
	) {

		public static ClubResponse of(Long clubId, String name, URL imageURL) {
			return ClubResponse.builder()
				.clubId(clubId)
				.name(name)
				.img(imageURL)
				.build();
		}
	}

	@Schema(description = "참여자 응답 스키마")
	@Builder
	public record ParticipantResponse(
		@Schema(description = "참여자 아이디", example = "1")
		Long participantId,

		@Schema(description = "멤버 아이디", example = "1")
		Long memberId,

		@Schema(description = "참석 여부", example = "true")
		Boolean isAttending,

		@Schema(description = "출결 상태", example = "PRESENT")
		DailyStatus dailyStatus,

		@Schema(description = "참여자 이름", example = "참여자 닉네임")
		String name,

		@Schema(description = "역할", example = "HOST")
		Role role,

		@Schema(description = "이미지 pre-signed url", example = "http://example.com")
		URL img
	) {

		public static ParticipantResponse of(Participant entity, Long memberId, String name,
			URL imageURL) {
			return ParticipantResponse.builder()
				.participantId(entity.getId())
				.memberId(memberId)
				.isAttending(entity.getIsAttending())
				.dailyStatus(entity.getDailyStatus())
				.name(name)
				.role(entity.getRole())
				.img(imageURL)
				.build();
		}
	}

	@Schema(description = "투표 응답 스키마")
	@Builder
	public record VoteResponse(
		@Schema(description = "투표 항목 ID", example = "1")
		Long voteItemId,

		@Schema(description = "제목", example = "투표 제목")
		String title,

		@Schema(description = "카테고리", example = "카테고리")
		String category,

		@Schema(description = "평균 소요 시간", example = "33")
		Integer avgDuration,

		@Schema(description = "링크 URL", example = "http://example.com")
		String linkUrl,

		@Schema(description = "도로명 주소", example = "서울시 강남구")
		String roadAddress,

		@Schema(description = "위도", example = "37.5665")
		Double latitude,

		@Schema(description = "경도", example = "126.9780")
		Double longitude,

		@Schema(description = "선택 여부", example = "true")
		Boolean isSelected,

		@Schema(description = "퍼센트", example = "0.5")
		Double percentage
	) {

		public static VoteResponse of(VoteItem entity, boolean isSelected, double percentage) {
			return VoteResponse.builder()
				.voteItemId(entity.getId())
				.title(entity.getTitle())
				.category(entity.getCategory())
				.avgDuration(entity.getAvgDuration())
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
		URL img,
		Appointment appointment,
		List<ParticipantResponse> participantResponses,
		List<VoteResponse> voteInfos,
		Long routineId
	) {
		return AppointmentDetailResponse.builder()
			.clubInfo(ClubResponse.of(clubId, clubName, img))
			.appointmentInfo(AppointmentResponse.of(appointment))
			.participantInfos(participantResponses)
			.voteInfos(voteInfos)
			.routineId(routineId)
			.build();
	}
}
