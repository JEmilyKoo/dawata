package com.ssafy.dawata.domain.member.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

	@GetMapping("/{memberId}")
	public Member getMember(@PathVariable("memberId") Long memberId) {
		return memberService.findMemberInfo(memberId);
	}

	@GetMapping()
	public Member getMyInfo() {
		return memberService.findMyMemberInfo();
	}

	@GetMapping("/appointment-info")
	public AppointmentInfoResponse getAllMyAppointment() {
		return memberService.findAllMyAppointmentInfo();
	}

	@PatchMapping()
	public MemberInfoResponse updateMyInfo(@RequestBody MemberInfoUpdateRequest memberInfoUpdateRequest) {
		return memberService.updateMyInfo(memberInfoUpdateRequest);
	}

	@DeleteMapping()
	public boolean withdrawInService() {
		return memberService.withdraw();
	}

	@PutMapping("/img")
	public boolean updateMyImg(@RequestBody String url) {
		return memberService.updateMyImg(url);
	}
}
