package com.ssafy.dawata.domain.club.dto.request;

import com.ssafy.dawata.domain.club.entity.ClubCategory;
public record UpdateClubRequest(
	String name,
	ClubCategory category,
	String img
){
}
