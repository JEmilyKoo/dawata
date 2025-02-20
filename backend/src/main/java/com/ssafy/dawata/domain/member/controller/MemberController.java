package com.ssafy.dawata.domain.member.controller;

import java.net.URL;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.dawata.domain.auth.entity.SecurityMemberDetails;
import com.ssafy.dawata.domain.common.dto.ApiResponse;
import com.ssafy.dawata.domain.common.service.S3Service;
import com.ssafy.dawata.domain.member.dto.request.MemberInfoUpdateRequest;
import com.ssafy.dawata.domain.member.dto.request.MemberPhotoRequest;
import com.ssafy.dawata.domain.member.dto.response.AppointmentInMonthResponse;
import com.ssafy.dawata.domain.member.dto.response.AppointmentInfoResponse;
import com.ssafy.dawata.domain.member.dto.response.MemberInfoResponse;
import com.ssafy.dawata.domain.member.service.MemberService;
import com.ssafy.dawata.domain.photo.enums.EntityCategory;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/members")
@RequiredArgsConstructor
public class MemberController {
	private final S3Service s3Service;
	private final MemberService memberService;

	@Operation(summary = "내 정보 조회",
		description = "내 정보를 조회하는 작업을 수행합니다.")
	@GetMapping()
	public ResponseEntity<ApiResponse<MemberInfoResponse>> getMyInfo(
		@AuthenticationPrincipal SecurityMemberDetails memberDetails
	) {
		return ResponseEntity.ok(ApiResponse.success(memberService.findMemberInfo(memberDetails.member().getId())));
	}

	@Operation(summary = "내 전체 약속 출결정보 조회",
		description = "내 전체 약속 출결정보를 조회하는 작업을 수행합니다.")
	@GetMapping("/appointment-info")
	public ResponseEntity<ApiResponse<List<AppointmentInfoResponse>>> getMyAppointmentConditions(
		@AuthenticationPrincipal SecurityMemberDetails memberDetails
	) {
		return ResponseEntity.ok(
			ApiResponse.success(memberService.findAllMyAppointmentCondition(memberDetails.member())));
	}

	@Operation(summary = "이번 달 약속 조회",
		description = "이번 달 약속을 조회하는 작업을 수행합니다.")
	@GetMapping("/appointment-info/{date}")
	public ResponseEntity<ApiResponse<List<AppointmentInMonthResponse>>> getMyAppointmentInMonth(
		@PathVariable("date") String date,
		@AuthenticationPrincipal SecurityMemberDetails memberDetails
	) {
		return ResponseEntity.ok(
			ApiResponse.success(memberService.findMyAppointmentInfoInMonth(date, memberDetails.member())));
	}

	@Operation(summary = "멤버 이름 변경",
		description = "유저 멤버 이름을 변경하는 작업을 수행합니다.")
	@PatchMapping()
	public ResponseEntity<ApiResponse<Void>> updateMyInfo(
		@RequestBody MemberInfoUpdateRequest memberInfoUpdateRequest,
		@AuthenticationPrincipal SecurityMemberDetails memberDetails
	) {
		memberService.updateMyInfo(memberInfoUpdateRequest, memberDetails.member().getId());
		return ResponseEntity.ok(ApiResponse.success());
	}

	/*
	 * TODO(고) : sqs가 안옴
	 * */
	@Operation(summary = "멤버 사진 추가",
		description = "유저 사진을 추가하는 작업을 수행합니다.")
	@PostMapping("/photo")
	public ResponseEntity<ApiResponse<URL>> createMyImg(
		@RequestBody MemberPhotoRequest memberPhotoRequest,
		@AuthenticationPrincipal SecurityMemberDetails memberDetails
	) {
		return ResponseEntity.ok(ApiResponse.success(
			s3Service.generatePresignedUrl(
				memberPhotoRequest.fileName(),
				"PUT",
				EntityCategory.MEMBER,
				memberDetails.member().getId()
			)));
	}

	/*
	 * TODO(고) : sqs가 안옴
	 * */
	@Operation(summary = "멤버 사진 변경",
		description = "유저 사진을 변경하는 작업을 수행합니다.")
	@PutMapping("/photo")
	public ResponseEntity<ApiResponse<URL>> updateMyImg(
		@RequestBody MemberPhotoRequest memberPhotoRequest,
		@AuthenticationPrincipal SecurityMemberDetails memberDetails
	) {
		return ResponseEntity.ok(ApiResponse.success(
			s3Service.generatePresignedUrl(
				memberPhotoRequest.fileName(),
				"PUT",
				EntityCategory.MEMBER,
				memberDetails.member().getId()
			)));
	}

	@Operation(summary = "멤버 삭제",
		description = "멤버를 삭제하는 작업을 수행합니다. data는 void  (null로 return)")
	@DeleteMapping()
	public ResponseEntity<ApiResponse<Void>> withdrawInService(
		@AuthenticationPrincipal SecurityMemberDetails memberDetails
	) {
		memberService.withdraw(memberDetails.member().getId());
		return ResponseEntity.ok(ApiResponse.success());
	}
}
