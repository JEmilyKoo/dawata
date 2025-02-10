package com.ssafy.dawata.domain.club.dto.request;

import com.ssafy.dawata.domain.common.enums.Category;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.Optional;

public record UpdateClubRequest(
        @Schema(description = "공식 클럽명", example = "알고리즘 스터디")
        Optional<String> name,
        @Schema(description = "클럽의 카테고리(1부터 6사이의 숫자)", example = "1")
        Optional<Category> category
) {
}
