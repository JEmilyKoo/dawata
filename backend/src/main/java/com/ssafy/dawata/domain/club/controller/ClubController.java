package com.ssafy.dawata.domain.club.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.dawata.domain.club.dto.request.BanClubMemberRequest;
import com.ssafy.dawata.domain.club.dto.request.CreateClubRequest;
import com.ssafy.dawata.domain.club.dto.request.JoinClubByCodeRequest;
import com.ssafy.dawata.domain.club.dto.request.JoinClubByEmailRequest;
import com.ssafy.dawata.domain.club.dto.request.UpdateClubMemberRequest;
import com.ssafy.dawata.domain.club.dto.request.UpdateClubRequest;
import com.ssafy.dawata.domain.club.dto.response.ClubInfoResponse;
import com.ssafy.dawata.domain.club.dto.response.ClubMemberInfoResponse;
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

	// 전체 클럽 조회
	@GetMapping
	public ResponseEntity<List<ClubInfoResponse>> getAllClubs() {
		List<ClubInfoResponse> responses = clubService.getAllClubsByMemberId();
		return ResponseEntity.ok(responses);
	}

	// 클럽 정보 수정
	@PatchMapping("/{clubId}")
	public ResponseEntity<Boolean> updateClub(@PathVariable Long clubId, @RequestBody UpdateClubRequest request) {
		try {
			clubService.updateClub(request,clubId);
			return ResponseEntity.ok(true);
		} catch (Exception e) {
			return ResponseEntity.status(500).body(false);
		}
	}

	// 클럽 삭제
	@DeleteMapping("/{clubId}")
	public ResponseEntity<Boolean> deleteClub(@PathVariable Long clubId) {
		try {
			clubService.deleteClub(clubId);
			return ResponseEntity.ok(true);
		} catch (Exception e) {
			return ResponseEntity.status(500).body(false);
		}
	}

	// 클럽 코드 조회
	@GetMapping("/{clubId}/code")
	public ResponseEntity<String> getClubCode(@PathVariable Long clubId) {
		String code = clubService.getClubCode(clubId);
		return ResponseEntity.ok(code);
	}

	// 클럽에 속하는 전체 멤버 데이터 조회
	@GetMapping("/{clubId}/members")
	public ResponseEntity<List<ClubMemberInfoResponse>> getClubMembers(@PathVariable Long clubId) {
		List<ClubMemberInfoResponse> members = clubService.getClubMembers(clubId);
		return ResponseEntity.ok(members);
	}

	// 클럽 내 특정 멤버 조회
	@GetMapping("/{clubId}/members/{clubMemberId}")
	public ResponseEntity<ClubMemberInfoResponse> getClubMember(@PathVariable Long clubId, @PathVariable Long clubMemberId) {
		ClubMemberInfoResponse response = clubService.getClubMember(clubId, clubMemberId);
		return ResponseEntity.ok(response);
	}

	// 이메일로 클럽 멤버 추가
	@PostMapping("/{clubId}/members/email")
	public ResponseEntity<Boolean> addClubMemberByEmail(@PathVariable Long clubId, @RequestBody JoinClubByEmailRequest request) {
		try {
			clubService.addClubMemberByEmail(request, clubId);
			return ResponseEntity.ok(true);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(false);
		}
	}

	// 코드로 클럽 멤버 추가
	@PostMapping("/{clubId}/members/code")
	public ResponseEntity<Boolean> addClubMemberByCode(@PathVariable Long clubId, @RequestBody JoinClubByCodeRequest request) {
		try {
			clubService.addClubMemberByCode(request, clubId);
			return ResponseEntity.ok(true);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(false);
		}
	}

	// 클럽 멤버 정보 수정
	@PatchMapping("/{clubId}/members/{clubMemberId}")
	public ResponseEntity<Boolean> updateClubMember(@PathVariable Long clubId, @RequestBody UpdateClubMemberRequest request) {
		try {
			clubService.updateClubMember(clubId, request);
			return ResponseEntity.ok(true);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(false);
		}
	}

	// 클럽 멤버 탈퇴
	@DeleteMapping("/{clubId}/members/{clubMemberId}")
	public ResponseEntity<Boolean> leaveClub(@PathVariable Long clubId, @PathVariable Long clubMemberId) {
		try {
			clubService.leaveClub(clubId, clubMemberId);
			return ResponseEntity.ok(true);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(false);
		}
	}

	// 클럽 멤버 강제 탈퇴 (클럽장만 가능)
	@DeleteMapping("/{clubId}/members/ban")
	public ResponseEntity<Boolean> banClubMember(@PathVariable Long clubId, @RequestBody BanClubMemberRequest request) {
		try {
			clubService.banClubMember(clubId, request);
			return ResponseEntity.ok(true);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(false);
		}
	}



}
