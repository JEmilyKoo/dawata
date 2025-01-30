package com.ssafy.dawata.domain.club.dto.request;

import com.ssafy.dawata.domain.common.enums.Category;

public record CreateClubRequest(
	String name,
	Category category
) {
}
