package com.ssafy.dawata.domain.live.dto.response;

import com.ssafy.dawata.domain.live.dto.ParticipantDto;
import com.ssafy.dawata.domain.photo.enums.EntityCategory;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Builder
@Schema(description = "약속 참가자 Response")
public record LiveParticipantResponse(
	@Schema(description = "멤버 Id (member id)", example = "1")
	Long memberId,
	@Schema(description = "멤버 이름 (club 이름)", example = "클럽 이름핑")
	String name,
	@Schema(description = "파일 pre-signedURL", example = "https://example.com")
	String fileName,
	@Schema(description = "멤버 lat좌표", example = "37.621594")
	Double latitude,
	@Schema(description = "멤버 lnt좌표", example = "127.066201")
	Double longitude
) {
	public static LiveParticipantResponse toResponse(
		ParticipantDto participantDto,
		String preSignedUrl,
		Double latitude,
		Double longitude) {

		return LiveParticipantResponse.builder()
			.memberId(participantDto.clubMember().getId())
			.name(participantDto.clubMember().getClubName())
			.fileName(preSignedUrl)
			.latitude(latitude)
			.longitude(longitude)
			.build();
	}
}
