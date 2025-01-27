package com.ssafy.dawata.domain.club.dto.request;

public record JoinClubByEmailRequest(
	Long adminId,
	Long memberId,
	Long clubId

) {
}
