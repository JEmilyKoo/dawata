package com.ssafy.dawata.domain.member.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.dawata.domain.common.dto.ApiResponse;
import com.ssafy.dawata.domain.member.dto.request.MemberInfoUpdateRequest;
import com.ssafy.dawata.domain.member.dto.response.AppointmentInfoResponse;
import com.ssafy.dawata.domain.member.dto.response.MemberInfoResponse;
import com.ssafy.dawata.domain.member.entity.Member;
import com.ssafy.dawata.domain.member.service.MemberService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/members")
@RequiredArgsConstructor
public class MemberController {

	private final MemberService memberService;

	@GetMapping()
	public ResponseEntity<ApiResponse<Member>> getMyInfo() {
		return ResponseEntity.ok(ApiResponse.success(memberService.findMyMemberInfo()));
	}

	@GetMapping("/{memberId}")
	public ResponseEntity<ApiResponse<MemberInfoResponse>> getMember(@PathVariable("memberId") Long memberId) {
		return ResponseEntity.ok(ApiResponse.success(memberService.findMemberInfo(memberId)));
	}

	@GetMapping("/appointment-info")
	public ResponseEntity<ApiResponse<AppointmentInfoResponse>> getAllMyAppointment() {
		return ResponseEntity.ok(ApiResponse.success(memberService.findAllMyAppointmentInfo()));
	}

	@PatchMapping()
	public ResponseEntity<ApiResponse<MemberInfoResponse>> updateMyInfo(
		@RequestBody MemberInfoUpdateRequest memberInfoUpdateRequest) {
		return ResponseEntity.ok(ApiResponse.success(memberService.updateMyInfo(memberInfoUpdateRequest)));
	}

	@DeleteMapping()
	public ResponseEntity<ApiResponse<Void>> withdrawInService() {
		memberService.withdraw();
		return ResponseEntity.ok(ApiResponse.success());
	}

	@PutMapping("/img")
	public ResponseEntity<ApiResponse<Void>> updateMyImg(@RequestBody String url) {
		memberService.updateMyImg(url);
		return ResponseEntity.ok(ApiResponse.success());
	}
}
