package com.ssafy.dawata.domain.club.dto.request;

public record JoinClubByCodeRequest(
	Long memberId,
	Long clubId,
	String teamCode
) {
}
