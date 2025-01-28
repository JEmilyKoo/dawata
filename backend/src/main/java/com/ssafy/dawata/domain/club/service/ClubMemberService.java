package com.ssafy.dawata.domain.club.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.dawata.domain.club.dto.response.ClubMemberInfoResponse;
import com.ssafy.dawata.domain.club.entity.ClubMember;
import com.ssafy.dawata.domain.club.repository.ClubMemberRepository;
import com.ssafy.dawata.domain.club.repository.ClubRepository;
import com.ssafy.dawata.domain.member.entity.Member;
import com.ssafy.dawata.domain.member.repository.MemberRepository;
import com.ssafy.dawata.domain.member.service.MemberService;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ClubMemberService {
	private final ClubMemberRepository clubMemberRepository;
	private final ClubRepository clubRepository;
	private final MemberService memberService;

	//클럽 id로 멤버 list 조회
	@Transactional(readOnly = true)
	public List<ClubMemberInfoResponse> getClubMembers(Long clubId) {
		List<ClubMember> clubMembers = clubMemberRepository.findAllByClubId(clubId);
		if (clubMembers.isEmpty()) {
			throw new IllegalArgumentException("해당 클럽에 멤버가 없습니다.");
		}
		return clubMembers.stream()
			.map(ClubMemberInfoResponse::from)
			.toList();
	}

	@Transactional(readOnly = true)
	public boolean isClubMember(Long clubId){
		Member member = memberService.findMyMemberInfo();
		return clubMemberRepository.existsByMemberIdAndClubId(member.getId(), clubId);
	}

	





}
