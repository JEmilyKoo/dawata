package com.ssafy.dawata.domain.club.dto.response;

import java.util.List;

import com.ssafy.dawata.domain.club.entity.Club;
import com.ssafy.dawata.domain.common.enums.Category;

public record ClubInfoResponse(
	Long id,
	String name,
	Category category,
	String teamCode,
	List<ClubMemberInfoResponse> members
) {
	public static ClubInfoResponse from(Club club, List<ClubMemberInfoResponse> members) {
		return new ClubInfoResponse(
			club.getId(),
			club.getName(),
			club.getCategory(),
			club.getTeamCode(),
			members
		);
	}
}
