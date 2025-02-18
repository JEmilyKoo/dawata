package com.ssafy.dawata.domain.club.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

public record JoinClubByEmailRequest(
        @Schema(description = "이메일로 추가할 유저들의 이메일 리스트", example = "test2@email.com")
        List<String> emails
) {
}
