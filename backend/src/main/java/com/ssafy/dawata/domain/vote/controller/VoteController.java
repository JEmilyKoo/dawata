package com.ssafy.dawata.domain.vote.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.dawata.domain.auth.entity.SecurityMemberDetails;
import com.ssafy.dawata.domain.common.dto.ApiResponse;
import com.ssafy.dawata.domain.vote.dto.request.VoteItemRequest;
import com.ssafy.dawata.domain.vote.dto.request.VotesRequest;
import com.ssafy.dawata.domain.vote.service.VoteService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/appointments")
public class VoteController {

	private final VoteService voteService;

	@PostMapping("/{appointmentId}/vote-items")
	@Operation(summary = "투표 항목 생성", description = "새로운 투표 항목을 생성합니다.")
	public ResponseEntity<ApiResponse<?>> createVoteItem(
		@AuthenticationPrincipal SecurityMemberDetails memberDetails,
		@PathVariable Long appointmentId,
		@RequestBody VoteItemRequest requestDto
	) {
		voteService.createVoteItem(requestDto, memberDetails.member().getId(), appointmentId);
		return ResponseEntity.ok(ApiResponse.success());
	}

	@PostMapping("/{appointmentId}/vote-items/votes")
	@Operation(summary = "투표", description = "투표 항목에 투표합니다.")
	public ResponseEntity<ApiResponse<?>> voting(
		@AuthenticationPrincipal SecurityMemberDetails memberDetails,
		@PathVariable Long appointmentId,
		@RequestBody VotesRequest requestDto
	) {
		voteService.voting(requestDto, memberDetails.member().getId(), appointmentId);
		return ResponseEntity.ok(ApiResponse.success());
	}
}
