package com.ssafy.dawata.domain.club.dto.request;

import java.util.Optional;
public record UpdateClubMemberRequest(
	Optional<String> nickname,
	Optional<String> clubName,

	Long clubMemberId
) {
}
