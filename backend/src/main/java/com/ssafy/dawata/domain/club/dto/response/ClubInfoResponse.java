package com.ssafy.dawata.domain.club.dto.response;

import com.ssafy.dawata.domain.club.entity.Club;
import com.ssafy.dawata.domain.club.entity.ClubCategory;

public record ClubInfoResponse(
	Long id,
	String name,
	ClubCategory category,
	String teamCode
)

{
	public static ClubInfoResponse from(Club club){
		return new ClubInfoResponse(
			club.getId(),
			club.getName(),
			club.getCategory(),
			club.getTeamCode()
		);
	}
}
