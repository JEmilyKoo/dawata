package com.ssafy.dawata.domain.club.dto.response;

import com.ssafy.dawata.domain.club.entity.ClubMember;
import io.swagger.v3.oas.annotations.media.Schema;

public record ClubMemberInfoResponse(
        @Schema(description = "클럽 내 멤버로서의 Pk")
        Long clubMemberId, //이름 변경 (클럽 내 멤버로서의 pk)
        @Schema(description = "클럽 회원의 member테이블 pk")
        Long memberId,
        @Schema(description = "클럽 아이디. 클럽 테이블의 pk")
        Long clubId,
        @Schema(description = "클럽 내 클라이언트의 닉네임")
        String nickname,
        @Schema(description = "사용자가 볼 클럽명")
        String clubName,
        int role

) {
    public static ClubMemberInfoResponse from(ClubMember clubMember) {
        return new ClubMemberInfoResponse(
                clubMember.getId(),
                clubMember.getMember().getId(),
                clubMember.getClub().getId(),
                clubMember.getNickname(),
                clubMember.getClubName(),
                clubMember.getRole()
        );
    }
}
