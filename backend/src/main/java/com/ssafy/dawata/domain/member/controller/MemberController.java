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
import com.ssafy.dawata.domain.member.service.MemberService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/members")
@RequiredArgsConstructor
public class MemberController {

	private final MemberService memberService;

	@Operation(summary = "내 정보 조회",
		description = "내 정보를 조회하는 작업을 수행합니다. img는 아직 구현 전 (null로 return)")
	@GetMapping()
	public ResponseEntity<ApiResponse<MemberInfoResponse>> getMyInfo() {
		return ResponseEntity.ok(ApiResponse.success(memberService.findMemberInfo()));
	}

	@Operation(summary = "내 전체 약속 정보 조회 (아직 구현 X)",
		description = "내 전체 약속 정보를 조회하는 작업을 수행합니다.")
	@GetMapping("/appointment-info")
	public ResponseEntity<ApiResponse<AppointmentInfoResponse>> getAllMyAppointment() {
		return ResponseEntity.ok(ApiResponse.success(memberService.findAllMyAppointmentInfo()));
	}

	@Operation(summary = "멤버 이름 변경",
		description = "유저 멤버 이름을 변경하는 작업을 수행합니다. img는 아직 구현 전 (null로 return)")
	@PatchMapping()
	public ResponseEntity<ApiResponse<MemberInfoResponse>> updateMyInfo(
		@RequestBody MemberInfoUpdateRequest memberInfoUpdateRequest) {
		return ResponseEntity.ok(ApiResponse.success(memberService.updateMyInfo(memberInfoUpdateRequest)));
	}

	@Operation(summary = "멤버 삭제",
		description = "멤버를 삭제하는 작업을 수행합니다. data는 void  (null로 return)")
	@DeleteMapping()
	public ResponseEntity<ApiResponse<Void>> withdrawInService() {
		memberService.withdraw();
		return ResponseEntity.ok(ApiResponse.success());
	}
}
