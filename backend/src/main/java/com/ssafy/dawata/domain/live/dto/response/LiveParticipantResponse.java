package com.ssafy.dawata.domain.live.dto.response;

import com.ssafy.dawata.domain.live.dto.ParticipantDto;
import com.ssafy.dawata.domain.live.enums.ArrivalState;
import com.ssafy.dawata.domain.photo.enums.EntityCategory;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Builder
@Schema(description = "약속 참가자 Response")
public record LiveParticipantResponse(
	@Schema(description = "멤버 Id (member id)", example = "1")
	Long memberId,
	@Schema(description = "멤버 이름 (club 이름)", example = "클럽 이름핑")
	String nickname,
	@Schema(description = "파일 pre-signedURL", example = "https://example.com")
	String img,
	@Schema(description = "멤버 lat좌표", example = "37.621594")
	Double latitude,
	@Schema(description = "멤버 lnt좌표", example = "127.066201")
	Double longitude,
	@Schema(description = "도착 여부", example = "NOT_ARRIVED")
	ArrivalState arrivalState,
	@Schema(description = "예상 도착시간", example = "300")
	Integer estimatedTime
) {
	public static LiveParticipantResponse toResponse(
		ParticipantDto participantDto,
		String preSignedUrl,
		Double latitude,
		Double longitude,
		ArrivalState arrivalState,
		Integer estimatedTime
	) {

		return LiveParticipantResponse.builder()
			.memberId(participantDto.clubMember().getMember().getId())
			.nickname(participantDto.clubMember().getNickname())
			.img(preSignedUrl)
			.latitude(latitude)
			.longitude(longitude)
			.arrivalState(arrivalState)
			.estimatedTime(estimatedTime)
			.build();
	}
}
