package com.ssafy.dawata.domain.club.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.Optional;

public record UpdateClubMemberRequest(
        @Schema(description = "클럽 내에서 보일 유저의 닉네임", example = "알고리즘왕")
        Optional<String> nickname,
        @Schema(description = "클럽 멤버 개인이 볼 클럽의 이름", example = "알고리즘 넘귀찮아")
        Optional<String> clubName
) {
}
