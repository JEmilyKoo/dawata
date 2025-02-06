package com.ssafy.dawata.domain.vote.dto.request;

import java.util.List;

import lombok.Builder;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "투표 요청 스키마")
@Builder
public record VotesRequest(
	@Schema(description = "투표 정보 리스트")
	List<VoteInfo> voteInfos
) {

	@Schema(description = "투표 정보")
	public record VoteInfo(
		@Schema(description = "투표 항목 ID", example = "1")
		Long voteItemId,

		@Schema(description = "선택 여부", example = "true")
		boolean isSelected
	) {

	}
}
