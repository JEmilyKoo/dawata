package com.ssafy.dawata.domain.club.controller;

import com.ssafy.dawata.domain.club.dto.request.*;
import com.ssafy.dawata.domain.club.dto.response.ClubInfoResponse;
import com.ssafy.dawata.domain.club.dto.response.ClubMemberInfoResponse;
import com.ssafy.dawata.domain.club.service.ClubService;
import com.ssafy.dawata.domain.common.dto.ApiResponse;
import com.ssafy.dawata.domain.member.dto.response.ClubJoinSearchResponse;
import com.ssafy.dawata.domain.member.dto.response.MemberInfoResponse;
import com.ssafy.dawata.domain.member.service.MemberService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clubs")
@RequiredArgsConstructor
public class ClubController {
	private final MemberService memberService;
	private final ClubService clubService;

	// 클럽 생성
	@PostMapping
	public ResponseEntity<ApiResponse<ClubInfoResponse>> createClub(
		@RequestBody CreateClubRequest request) {
		return ResponseEntity.ok(clubService.createClub(request));
	}

	// 특정 클럽 조회
	@GetMapping("/{clubId}")
	public ResponseEntity<ApiResponse<ClubInfoResponse>> getClubById(@PathVariable Long clubId) {
		return ResponseEntity.ok(clubService.getClubById(clubId));
	}

	// 전체 클럽 조회
	@GetMapping
	public ResponseEntity<ApiResponse<List<ClubInfoResponse>>> getAllClubs() {
		return ResponseEntity.ok(clubService.getAllClubsByMemberId());
	}

	// 클럽 정보 수정
	@PatchMapping("/{clubId}")
	public ResponseEntity<ApiResponse<Boolean>> updateClub(@PathVariable Long clubId,
		@RequestBody UpdateClubRequest request) {
		return ResponseEntity.ok(clubService.updateClub(request, clubId));
	}

	// 클럽 삭제
	@DeleteMapping("/{clubId}")
	public ResponseEntity<ApiResponse<Boolean>> deleteClub(@PathVariable Long clubId) {
		return ResponseEntity.ok(clubService.deleteClub(clubId));
	}

	// 클럽 코드 조회
	@GetMapping("/{clubId}/code")
	public ResponseEntity<ApiResponse<String>> getClubCode(@PathVariable Long clubId) {
		return ResponseEntity.ok(clubService.getClubCode(clubId));
	}

	// 클럽에 속하는 전체 멤버 데이터 조회
	@GetMapping("/{clubId}/members")
	public ResponseEntity<ApiResponse<List<ClubMemberInfoResponse>>> getClubMembers(
		@PathVariable Long clubId) {
		return ResponseEntity.ok(clubService.getClubMembers(clubId));
	}

	// 클럽 내 특정 멤버 조회
	@GetMapping("/{clubId}/members/{clubMemberId}")
	public ResponseEntity<ApiResponse<ClubMemberInfoResponse>> getClubMember(
		@PathVariable Long clubId,
		@PathVariable Long clubMemberId) {
		return ResponseEntity.ok(clubService.getClubMember(clubId, clubMemberId));
	}

	// 이메일로 초대한 사람 검색
	@PostMapping("/search/email")
	public ResponseEntity<ApiResponse<ClubJoinSearchResponse>> searchMemberByEmail(
		@RequestBody ClubJoinSearchRequest clubJoinSearchRequest
	) {
		return ResponseEntity.ok(ApiResponse.success(memberService.findUserEmail(clubJoinSearchRequest)));
	}

	// 이메일로 클럽 멤버 추가
	@PostMapping("/{clubId}/members/email")
	public ResponseEntity<ApiResponse<Boolean>> addClubMemberByEmail(@PathVariable Long clubId,
		@RequestBody JoinClubByEmailRequest request) {
		return ResponseEntity.ok(clubService.addClubMemberByEmail(request, clubId));
	}

	// 코드로 클럽 멤버 추가
	@PostMapping("/{clubId}/members/code")
	public ResponseEntity<ApiResponse<Boolean>> addClubMemberByCode(@PathVariable Long clubId,
		@RequestBody JoinClubByCodeRequest request) {
		return ResponseEntity.ok(clubService.addClubMemberByCode(request, clubId));
	}

	// 클럽 멤버 정보 수정
	@PatchMapping("/{clubId}/members/{clubMemberId}")
	public ResponseEntity<ApiResponse<Boolean>> updateClubMember(@PathVariable Long clubId,
		@PathVariable Long clubMemberId,
		@RequestBody UpdateClubMemberRequest request) {
		return ResponseEntity.ok(clubService.updateClubMember(clubId, clubMemberId, request));
	}

	// 클럽 멤버 탈퇴
	@DeleteMapping("/{clubId}/members/{clubMemberId}")
	public ResponseEntity<ApiResponse<Boolean>> leaveClub(@PathVariable Long clubId,
		@PathVariable Long clubMemberId) {
		return ResponseEntity.ok(clubService.leaveClub(clubId, clubMemberId));
	}

	// 클럽 멤버 강제 탈퇴 (클럽장만 가능)
	@DeleteMapping("/{clubId}/members/ban")
	public ResponseEntity<ApiResponse<Boolean>> banClubMember(@PathVariable Long clubId,
		@RequestBody BanClubMemberRequest request) {
		return ResponseEntity.ok(clubService.banClubMember(clubId, request));
	}

	//클럽장 교체 (클럽장만 가능)
	@PatchMapping("/{clubId}/admin")
	public ResponseEntity<ApiResponse<Boolean>> updateClubAdmin(@PathVariable Long clubId,
		@RequestBody UpdateAdminRequest request) {
		ApiResponse<Boolean> response = clubService.updateAdmin(request, clubId);
		return ResponseEntity.ok(response);
	}

	//사진 추가
	@PutMapping("/{clubId}/clubImg")
	public ResponseEntity<ApiResponse<Boolean>> updateClubPhoto(@PathVariable Long clubId,
		@RequestBody
		ClubPhotoRequest request) {
		ApiResponse<Boolean> response = clubService.updateClubPhoto(clubId, request);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/{clubId}/photo")
	public ApiResponse<String> getClubPhoto(@PathVariable Long clubId) {
		return clubService.getClubPhoto(clubId);
	}

	//사진 삭제
	@DeleteMapping("/{clubId}/clubImg")
	public ResponseEntity<ApiResponse<Boolean>> deleteClubPhoto(@PathVariable Long clubId) {
		ApiResponse<Boolean> response = clubService.deleteClubPhoto(clubId);
		return ResponseEntity.ok(response);
	}

}
