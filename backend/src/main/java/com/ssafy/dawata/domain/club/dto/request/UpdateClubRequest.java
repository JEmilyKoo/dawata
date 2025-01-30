package com.ssafy.dawata.domain.club.dto.request;

import com.ssafy.dawata.domain.common.enums.Category;

import java.util.Optional;

public record UpdateClubRequest(
	Optional<String> name,
	Optional<Category> category
) {
}
