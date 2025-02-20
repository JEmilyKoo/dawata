package com.ssafy.dawata.domain.feed.dto.response;

import com.ssafy.dawata.domain.feed.entity.TagMember;

public record TagMemberResponse(
    Long clubMemberId,
    String nickname
) {

    public static TagMemberResponse from(TagMember tagMember) {
        return new TagMemberResponse(
            tagMember.getClubMember().getId(), // clubMemberId
            tagMember.getClubMember().getNickname() // ClubMember의 nickname
        );
    }


}
