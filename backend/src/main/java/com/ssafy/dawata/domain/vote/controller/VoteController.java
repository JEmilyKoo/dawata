package com.ssafy.dawata.domain.vote.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.dawata.domain.vote.dto.request.VoteItemRequest;
import com.ssafy.dawata.domain.vote.dto.request.VotesRequest;
import com.ssafy.dawata.domain.vote.service.VoteService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/appointments")
public class VoteController {

	private final VoteService voteService;

	@PostMapping("/{appointmentId}/vote-items")
	public void createVoteItem(@PathVariable Long appointmentId, @RequestBody VoteItemRequest requestDto) {
		voteService.createVoteItem(requestDto, appointmentId);
	}

	@PostMapping("/{appointmentId}/vote-items/votes")
	public void voting(@PathVariable Long appointmentId, @RequestBody VotesRequest requestDto) {
		voteService.voting(requestDto, appointmentId);
	}
}
