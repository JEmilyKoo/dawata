package com.ssafy.dawata.domain.club.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

public record BanClubMemberRequest(
        @Schema(description = "탈퇴시킬 유저의 memberId", example = "1")
        Long memberId
) {

}
