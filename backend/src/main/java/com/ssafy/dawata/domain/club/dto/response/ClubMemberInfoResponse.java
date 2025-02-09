package com.ssafy.dawata.domain.club.dto.response;

import com.ssafy.dawata.domain.club.entity.ClubMember;

public record ClubMemberInfoResponse(
        Long clubMemberId, //이름 변경 (클럽 내 멤버로서의 pk)
        Long memberId,
        Long clubId,
        String nickname,
        String clubName,
        int createdBy

) {
    public static ClubMemberInfoResponse from(ClubMember clubMember) {
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
