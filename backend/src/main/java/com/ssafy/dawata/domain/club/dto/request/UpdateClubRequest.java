package com.ssafy.dawata.domain.club.dto.request;

import java.util.Optional;

import com.ssafy.dawata.domain.club.entity.ClubCategory;
public record UpdateClubRequest(
	Long clubId,
	Optional<String> name,
	Optional<ClubCategory> category
){
}
