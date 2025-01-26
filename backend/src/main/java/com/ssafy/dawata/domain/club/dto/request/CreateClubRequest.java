package com.ssafy.dawata.domain.club.dto.request;

import com.ssafy.dawata.domain.club.entity.ClubCategory;

public record CreateClubRequest(
	String name,
	ClubCategory category
)
{
}
