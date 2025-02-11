package com.ssafy.dawata.domain.club.dto.response;

import com.ssafy.dawata.domain.club.entity.Club;
import com.ssafy.dawata.domain.common.enums.Category;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.List;

public record ClubInfoResponse(
	@Schema(description = "클럽 id, 클럽엔티티의 pk")
	Long clubId,
	@Schema(description = "클럽 명")
	String name,
	@Schema(description = "클럽 카테고리")
	Category category,
	@Schema(description = "클럽 가입시 사용할 팀코드")
	String teamCode,
	@Schema(description = "클럽 대표이미지 파일명")
	String img,
	@Schema(description = "클럽 생성날짜")
	LocalDateTime createDate,
	@Schema(description = "클럽에 가입한 사람들")
	List<ClubMemberInfoResponse> members
) {

	public static ClubInfoResponse from(Club club, String img, List<ClubMemberInfoResponse> members) {
		return new ClubInfoResponse(
			club.getId(),
			club.getName(),
			club.getCategory(),
			club.getTeamCode(),
			img,
			club.getCreatedAt(),
			members
		);
	}
}
