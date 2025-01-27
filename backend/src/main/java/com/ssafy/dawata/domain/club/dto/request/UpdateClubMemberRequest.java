package com.ssafy.dawata.domain.club.dto.request;

public record UpdateClubMemberRequest(
	Long memberId,
	String nickname,
	String clubName
) {
}
