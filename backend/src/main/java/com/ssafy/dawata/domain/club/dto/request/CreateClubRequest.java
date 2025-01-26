package com.ssafy.dawata.domain.club.dto.request;

import com.ssafy.dawata.domain.club.entity.ClubCategory;

public record CreateGroupRequest (
	String name,
	ClubCategory category
)
{
}
