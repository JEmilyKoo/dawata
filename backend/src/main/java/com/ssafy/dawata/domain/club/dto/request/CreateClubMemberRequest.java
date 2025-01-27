package com.ssafy.dawata.domain.club.dto.request;

public record CreateClubMemberRequest
	(
		Long memberId,
		Long clubId,
		int createdBy
	){
}
