package com.ssafy.dawata.domain.club.dto.response;

import com.ssafy.dawata.domain.club.entity.ClubMember;

public record ClubMemberInfoResponse (
	Long id,
	Long memberId,
	Long clubId,
	String nickname,
	String clubName,
	int createdBy

)

{
	public static ClubMemberInfoResponse from(ClubMember clubMember){
		return new ClubMemberInfoResponse(
			clubMember.getId(),
			clubMember.getMember().getId(),
			clubMember.getClub().getId(),
			clubMember.getNickname(),
			clubMember.getClubName(),
			clubMember.getCreatedBy()
		);
	}
}
