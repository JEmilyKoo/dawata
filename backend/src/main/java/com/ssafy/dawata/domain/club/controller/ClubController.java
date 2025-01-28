package com.ssafy.dawata.domain.club.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.dawata.domain.club.dto.request.CreateClubRequest;
import com.ssafy.dawata.domain.club.dto.response.ClubInfoResponse;
import com.ssafy.dawata.domain.club.service.ClubService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/clubs")
@RequiredArgsConstructor
public class ClubController {
	private final ClubService clubService;

	//클럽 생성
	@PostMapping
	public ResponseEntity<ClubInfoResponse> createClub(@RequestBody CreateClubRequest request) {
		ClubInfoResponse response = clubService.createClub(request);
		return ResponseEntity.ok(response);
	}

	//특정 클럽 조회
	@GetMapping("/{clubId}")
	public ResponseEntity<ClubInfoResponse>getClubById(@PathVariable Long clubId){
		ClubInfoResponse response = clubService.getClubById(clubId);
		return ResponseEntity.ok(response);
	}



}
