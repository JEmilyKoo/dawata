package com.ssafy.dawata.domain.club.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ssafy.dawata.domain.club.dto.request.CreateClubRequest;
import com.ssafy.dawata.domain.club.dto.request.UpdateAdminRequest;
import com.ssafy.dawata.domain.club.dto.request.UpdateClubRequest;
import com.ssafy.dawata.domain.club.dto.response.ClubInfoResponse;
import com.ssafy.dawata.domain.club.entity.Club;
import com.ssafy.dawata.domain.club.entity.ClubMember;
import com.ssafy.dawata.domain.club.repository.ClubMemberRepository;
import com.ssafy.dawata.domain.club.repository.ClubRepository;
import com.ssafy.dawata.domain.member.entity.Member;
import com.ssafy.dawata.domain.member.service.MemberService;
import com.ssafy.dawata.domain.club.dto.*;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ClubService {
	private final ClubRepository clubRepository;
	private final ClubMemberRepository clubMemberRepository;
	private final MemberService memberService;


	//클럽 생성
	public ClubInfoResponse createClub(CreateClubRequest request){
		//추후에 SecurityContextHolder에서 가져오도록 하겠습니다.
		Member member = memberService.findMyMemberInfo();
		String teamCode = generateTeamCode();
		Club club = Club.createClub(request.name(), request.category(),teamCode);

		clubRepository.save(club);

		ClubMember clubMember = ClubMember.createClubMember(member,club,0);
		clubMemberRepository.save(clubMember);

		return ClubInfoResponse.from(club);

	}


	//멤버가 속해있는 특정 클럽 id로 데이터 조회하기
	@Transactional(readOnly = true)
	public ClubInfoResponse getClubById(Long clubId){
		Member member = memberService.findMyMemberInfo();
		//해당 클럽에 속해 있는지 체크
		validateMember(member.getId(),clubId);

		Club club = clubRepository.findById(clubId)
			//예외 분리 곧 ..!
			.orElseThrow(() -> new IllegalArgumentException("해당 id의 클럽 없음"));

		return ClubInfoResponse.from(club);
	}

	//클라이언트의 멤버 정보 가져와서 -> 해당 유저가 속한 모든 그룹의 정보 가져오기
	//Member랑 Club 엔티티가 직접 연결되어 있지 않아서 ClubMember를 거쳐서 데이터를 가져오는데
	// 보통 이렇게 하는 게 맞나요 ..
	@Transactional(readOnly = true)
	public List<ClubInfoResponse> getAllClubsByMemberId(){
		Member member = memberService.findMyMemberInfo();
		List<ClubMember> clubMembers = clubMemberRepository.findAllById(Collections.singleton(member.getId()));
		// 이 부분에서 왜 .. Repository에서 적은 Long 타입을 파라미터로 보냈는데 에러가 날까요 .. (일단 추천 수정 방식으로 수정했음다 ..)

		return clubMembers.stream()
			.map(clubMember -> ClubInfoResponse.from(clubMember.getClub()))
			.collect(Collectors.toList());

	}

	//클럽 데이터 수정
	public void updateClub(UpdateClubRequest request){
		Member member = memberService.findMyMemberInfo();
		validateMember(member.getId(),request.clubId());

		Club club = clubRepository.findById(request.clubId()).
			orElseThrow(()-> new IllegalArgumentException("해당 id의 클럽 없음"));

		//클럽명 전달 값 존재 시 반영
		request.name().ifPresent(club::updateName);
		//카테고리 전달 값 존재 시 반영
		request.category().ifPresent(club::updateCategory);
	}

	//클럽장 교체
	public boolean updateAdmin(UpdateAdminRequest request){
		//멤버 아이디랑 클럽 아이디로 요청자가 해당 클럽의 멤버인지 체크 -> 해당 클럽의 운영자인지 체크
		Optional<ClubMember> checkCurrentAdmin = clubMemberRepository.findByMemberIdAndClubId(request.currentAdminId(), request.clubId());
		if (checkCurrentAdmin.isEmpty()||checkCurrentAdmin.get().getCreatedBy()!=0){
			throw new IllegalArgumentException("요청자가 관리자 아님");
		}

		//멤버 아이디와 클럽 아이디로 새로운 교체자가 클럽의 기존 멤버인지 체크
		Optional<ClubMember> checkNewAdmin = clubMemberRepository.findByMemberIdAndClubId(request.newAdminId(),request.clubId());
		if (checkNewAdmin.isEmpty()){
			throw new IllegalArgumentException("새로운 관리자가 클럽 멤버가 아님.");
		}

		ClubMember currentAdmin = checkCurrentAdmin.get();
		ClubMember newAdmin = checkNewAdmin.get();

		currentAdmin.setCreatedBy(1);
		newAdmin.setCreatedBy(0);

		return true;



	}

	private void validateMember(Long memberId, Long clubId) {
		boolean isMember = clubMemberRepository.existsByMemberIdAndClubId(memberId, clubId);

		if (!isMember){
			throw new IllegalArgumentException("해당 멤버가 클럽 멤버가 아님");
		}
	}

	private String generateTeamCode() {
		String teamCode="123456";
		return teamCode;
	}

}
