package com.ssafy.dawata.domain.club.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.dawata.domain.club.dto.response.ClubMemberInfoResponse;
import com.ssafy.dawata.domain.club.service.ClubMemberService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/clubs/{clubId}/members")
@RequiredArgsConstructor
public class ClubMemberController {
	private final ClubMemberService clubMemberService;
	@GetMapping
	public List<ClubMemberInfoResponse> getClubMembers(@PathVariable Long clubId){
		return clubMemberService.getClubMembers(clubId);
	}
}
