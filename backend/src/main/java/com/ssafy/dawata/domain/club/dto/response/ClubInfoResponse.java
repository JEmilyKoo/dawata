package com.ssafy.dawata.domain.club.dto.response;

import com.ssafy.dawata.domain.club.entity.Club;
import com.ssafy.dawata.domain.common.enums.Category;
import java.util.List;

public record ClubInfoResponse(
    Long id,
    String name,
    Category category,
    String teamCode,
    String img,
    List<ClubMemberInfoResponse> members
) {

    public static ClubInfoResponse from(Club club, List<ClubMemberInfoResponse> members) {
        return new ClubInfoResponse(
            club.getId(),
            club.getName(),
            club.getCategory(),
            club.getTeamCode(),
            club.getImg(),
            members
        );
    }
}
