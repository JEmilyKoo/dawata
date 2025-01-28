package com.ssafy.dawata.domain.club.service;

import java.util.List;

import org.hibernate.mapping.Join;
import org.springframework.stereotype.Service;

import com.ssafy.dawata.domain.club.dto.request.JoinClubByCodeRequest;
import com.ssafy.dawata.domain.club.dto.request.JoinClubByEmailRequest;
import com.ssafy.dawata.domain.club.dto.response.ClubMemberInfoResponse;
import com.ssafy.dawata.domain.club.entity.Club;
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
	private final MemberRepository memberRepository;

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

	//이메일로 멤버 추가
	public void addClubMemberByEmail(JoinClubByEmailRequest request,long clubId){
		//추가해 주는 멤버가 이미 클럽 멤버인지 체크
		if (!clubMemberRepository.existsByMemberIdAndClubId(request.adminId(), clubId)) {
			throw new IllegalArgumentException("요청자가 클럽 멤버 아님");
		}

		//추가할 이메일이 멤버로 존재하는지 체크
		Member newMember = memberRepository.findById(request.memberId())
			.orElseThrow(()-> new IllegalArgumentException("해당 email의 user없음"));

		//추가할 멤버가 이미 클럽 멤버인지 체크
		if (clubMemberRepository.existsByMemberIdAndClubId(request.memberId(),clubId)){
			throw new IllegalArgumentException("추가할 멤버가 이미 클럽 멤버임");
		}

		//참여하려는 id의 클럽이 존재하는지 체크
		Club club = clubRepository.findById(clubId)
			.orElseThrow(() -> new IllegalArgumentException("요청 클럽id의 클럽 존재 X"));

		ClubMember clubMember = ClubMember.createClubMember(newMember, club,1);
		clubMemberRepository.save(clubMember);
	}

	//코드로 멤버 추가
	@Transactional
	public void addClubMemberByCode(JoinClubByCodeRequest request, Long clubId){
		Member newMember = memberRepository.findById(request.memberId())
			.orElseThrow(()-> new IllegalArgumentException("해당 id의 member없음"));


		//참여하려는 id의 클럽이 존재하는지 체크
		Club club = clubRepository.findById(clubId)
			.orElseThrow(() -> new IllegalArgumentException("요청 클럽id의 클럽 존재 X"));

		if (!club.getTeamCode().equals(request.teamCode())) {
			throw new IllegalArgumentException("팀 코드 일치X");
		}

		//추가할 멤버가 이미 팀에 속해있는지 체크
		if (clubMemberRepository.existsByMemberIdAndClubId(request.memberId(),clubId)) {
			throw new IllegalArgumentException("해당 멤버는 이미 클럽에 속해 있습니다.");
		}

		ClubMember clubMember = ClubMember.createClubMember(newMember, club,1);
		clubMemberRepository.save(clubMember);


	}









}
