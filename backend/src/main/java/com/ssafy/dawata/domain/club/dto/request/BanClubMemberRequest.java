package com.ssafy.dawata.domain.club.dto.request;

public record BanClubMemberRequest(
	Long adminId,
	Long memberId
) {

}
