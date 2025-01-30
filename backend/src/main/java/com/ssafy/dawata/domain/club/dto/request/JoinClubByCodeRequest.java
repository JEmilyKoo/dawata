package com.ssafy.dawata.domain.club.dto.request;

public record JoinClubByCodeRequest(
	Long memberId,
	String teamCode
) {
}
