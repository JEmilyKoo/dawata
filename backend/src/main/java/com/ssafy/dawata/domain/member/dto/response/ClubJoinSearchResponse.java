package com.ssafy.dawata.domain.member.dto.response;

public record ClubJoinSearchResponse(
	Long id,
	String email,
	String name,
	String photoName
) {
}
