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

import com.ssafy.dawata.domain.club.dto.request.CreateClubRequest;
import com.ssafy.dawata.domain.club.dto.request.UpdateClubRequest;
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
			return ResponseEntity.ok(true); // 삭제 성공 시 true 반환
		} catch (Exception e) {
			return ResponseEntity.status(500).body(false); // 삭제 실패 시 false 반환
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







}
