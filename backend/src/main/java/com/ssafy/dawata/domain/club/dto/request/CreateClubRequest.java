package com.ssafy.dawata.domain.club.dto.request;

import com.ssafy.dawata.domain.common.enums.Category;
import io.swagger.v3.oas.annotations.media.Schema;

public record CreateClubRequest(
        @Schema(description = "그룹명", example = "알고리즘스터디")
        String name,
        @Schema(description = "그룹의 카테고리(1과 6사이의 숫자)", example = "1")
        Category category
) {
}
