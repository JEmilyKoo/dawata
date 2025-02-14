package com.ssafy.dawata.domain.live.dto;

import com.ssafy.dawata.domain.club.entity.ClubMember;

public record ParticipantDto(
	ClubMember clubMember,
	String fileName
) {
}
