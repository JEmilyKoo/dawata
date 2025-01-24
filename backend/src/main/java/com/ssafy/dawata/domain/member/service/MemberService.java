package com.ssafy.dawata.domain.member.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.dawata.domain.member.entity.Member;
import com.ssafy.dawata.domain.member.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberService {

	private final MemberRepository memberRepository;

	@Transactional(readOnly = true)
	public Member findMyMemberInfo() {
		// TODO: Test를 위한 코드 추후에 SecurityContextHolder 에서 정보 가져오기
		Long id = 1L;
		return memberRepository
			.findById(id)
			.orElseThrow(IllegalArgumentException::new);
	}

	@Transactional(readOnly = true)
	public Member findMemberInfo(Long memberId) {
		return memberRepository
			.findById(memberId)
			.orElseThrow(IllegalArgumentException::new);
	}
}
