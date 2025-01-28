package com.ssafy.dawata.domain.club.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.dawata.domain.club.dto.request.JoinClubByCodeRequest;
import com.ssafy.dawata.domain.club.dto.request.JoinClubByEmailRequest;
import com.ssafy.dawata.domain.club.dto.response.ClubMemberInfoResponse;
import com.ssafy.dawata.domain.club.service.ClubMemberService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/clubs/{clubId}/members")
@RequiredArgsConstructor
public class ClubMemberController {
	private final ClubMemberService clubMemberService;

	@GetMapping
	public ResponseEntity<List<ClubMemberInfoResponse>> getClubMembers(@PathVariable Long clubId) {
		List<ClubMemberInfoResponse> members = clubMemberService.getClubMembers(clubId);
		return ResponseEntity.ok(members);
	}

	//이메일로 클럽멤버 추가
	@PostMapping("/email")
	public ResponseEntity<Boolean> addClubMemberByEmail(@PathVariable Long clubId,
		@RequestBody JoinClubByEmailRequest request) {
		try {
			clubMemberService.addClubMemberByEmail(request, clubId);
			return ResponseEntity.ok(true);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(false);
		}
	}

	//코드로 클럽멤버 추가
	@PostMapping("/code")
	public ResponseEntity<Boolean> addClubMemberByCode(
		@PathVariable Long clubId,
		@RequestBody JoinClubByCodeRequest request) {
		try {
			clubMemberService.addClubMemberByCode(request, clubId);
			return ResponseEntity.ok(true);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(false);
		}
	}
}
