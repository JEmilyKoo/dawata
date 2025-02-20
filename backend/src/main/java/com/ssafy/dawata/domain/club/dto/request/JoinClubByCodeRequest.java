package com.ssafy.dawata.domain.club.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

public record JoinClubByCodeRequest(
        @Schema(description = "클럽에 가입할 유저의 memberId", example = "1")
        Long memberId,
        @Schema(description = "팀의 코드", example = "a12345")
        String teamCode
) {
}
