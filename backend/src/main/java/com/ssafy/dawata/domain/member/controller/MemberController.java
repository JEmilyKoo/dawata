package com.ssafy.dawata.domain.member.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.dawata.domain.member.entity.Member;
import com.ssafy.dawata.domain.member.service.MemberService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/members")
@RequiredArgsConstructor
public class MemberController {

	private final MemberService memberService;

	@GetMapping("/{memberId}")
	public Member getMember(@PathVariable Long memberId) {
		return memberService.findMemberInfo(memberId);
	}

	@GetMapping("/my")
	public Member getMyMember() {
		return memberService.findMyMemberInfo();
	}
}
