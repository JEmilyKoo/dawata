package com.ssafy.dawata.domain.club.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

public record UpdateAdminRequest(
        @Schema(description = "새로이 클럽장이 될 유저의 memberId", example = "3")
        Long newAdminId
) {
}
