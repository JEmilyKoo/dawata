package com.ssafy.dawata.domain.club.dto.request;

public record InviteClubMemberRequest(
	Long memberId,
	Long clubId
) {
}
