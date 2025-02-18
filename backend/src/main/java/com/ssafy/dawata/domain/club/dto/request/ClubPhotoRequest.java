package com.ssafy.dawata.domain.club.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

public record ClubPhotoRequest(
        @Schema(description = "이미지 이름", example = "CLUB_2025-02-03T18:55:40.170908700_userEmail.png")
        String fileName

) {
}
