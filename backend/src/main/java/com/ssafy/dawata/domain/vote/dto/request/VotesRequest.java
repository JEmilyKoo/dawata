package com.ssafy.dawata.domain.vote.dto.request;

import java.util.List;

import lombok.Builder;

/**
 * 투표하기 DTO
 */
@Builder
public record VotesRequest(
	List<VoteInfo> voteInfos
) {

	public record VoteInfo(
		Long voteItemId,
		boolean isSelected
	) {

	}
}
