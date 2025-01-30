package com.ssafy.dawata.domain.club.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.dawata.domain.club.dto.request.BanClubMemberRequest;
import com.ssafy.dawata.domain.club.dto.request.CreateClubRequest;
import com.ssafy.dawata.domain.club.dto.request.JoinClubByCodeRequest;
import com.ssafy.dawata.domain.club.dto.request.JoinClubByEmailRequest;
import com.ssafy.dawata.domain.club.dto.request.UpdateAdminRequest;
import com.ssafy.dawata.domain.club.dto.request.UpdateClubMemberRequest;
import com.ssafy.dawata.domain.club.dto.request.UpdateClubRequest;
import com.ssafy.dawata.domain.club.dto.response.ClubInfoResponse;
import com.ssafy.dawata.domain.club.dto.response.ClubMemberInfoResponse;
import com.ssafy.dawata.domain.club.entity.Club;
import com.ssafy.dawata.domain.club.entity.ClubMember;
import com.ssafy.dawata.domain.club.repository.ClubMemberRepository;
import com.ssafy.dawata.domain.club.repository.ClubRepository;
import com.ssafy.dawata.domain.member.entity.Member;
import com.ssafy.dawata.domain.member.repository.MemberRepository;
import com.ssafy.dawata.domain.member.service.MemberService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ClubService {
	private final ClubRepository clubRepository;
	private final MemberRepository memberRepository;
	private final ClubMemberRepository clubMemberRepository;
	private final MemberService memberService;

	//클럽 생성
	public ClubInfoResponse createClub(CreateClubRequest request) {
		//추후에 SecurityContextHolder에서 가져오도록 하겠습니다.
		Member member = memberService.findMyMemberInfo();
		List<ClubMember> clubMembers = clubMemberRepository.findAllByMemberId(member.getId());
		String teamCode = generateTeamCode();
		Club club = Club.createClub(request.name(), request.category(), teamCode);

		clubRepository.save(club);

		ClubMember clubMember = ClubMember.createClubMember(member, club, 0);
		clubMemberRepository.save(clubMember);
		List<ClubMemberInfoResponse> members = getMembersForResponse(club.getId());
		clubMemberRepository.save(clubMember);

		return ClubInfoResponse.from(club, members);

	}

	//멤버가 속해있는 특정 클럽 id로 데이터 조회하기
	@Transactional(readOnly = true)
	public ClubInfoResponse getClubById(Long clubId) {
		Member member = memberService.findMyMemberInfo();
		Club club = validateClubAndMember(clubId, member.getId());
		List<ClubMemberInfoResponse> members = getMembersForResponse(club.getId());

		return ClubInfoResponse.from(club, members);
	}

	//클라이언트의 멤버 정보 가져와서 -> 해당 유저가 속한 모든 그룹의 정보 가져오기
	//Member랑 Club 엔티티가 직접 연결되어 있지 않아서 ClubMember를 거쳐서 데이터를 가져오는데
	// 보통 이렇게 하는 게 맞나요 ..
	@Transactional(readOnly = true)
	public List<ClubInfoResponse> getAllClubsByMemberId() {
		Member member = memberService.findMyMemberInfo();
		List<ClubMember> clubMembers = clubMemberRepository.findAllByMemberId(member.getId());
		return clubMembers.stream()
			.map(clubMember -> {
				Club club = clubMember.getClub();
				List<ClubMemberInfoResponse> members = getMembersForResponse(club.getId());
				return ClubInfoResponse.from(club, members);
			})
			.collect(Collectors.toList());

	}

	//클럽 데이터 수정
	public boolean updateClub(UpdateClubRequest request, Long clubId) {
		//클라이언트의 멤버데이터 가져오고
		Member member = memberService.findMyMemberInfo();
		//해당 멤버가 팀에 속하는지 체크하고, 해당 클럽 id의 클럽 존재 체크
		Club club = validateClubAndMember(clubId, member.getId());

		//클럽명 요청 값 존재 시 반영
		request.name().ifPresent(club::updateName);
		//카테고리 요청 값 존재 시 반영
		request.category().ifPresent(club::updateCategory);
		clubRepository.save(club);
		return true;
	}

	//클럽장 교체
	public boolean updateAdmin(UpdateAdminRequest request, Long clubId) {
		ClubMember currentAdmin = validateAdmin(request.currentAdminId(), clubId);
		ClubMember newAdmin = validateMember(request.newAdminId(), clubId);

		currentAdmin.setCreatedBy(1);
		newAdmin.setCreatedBy(0);

		return true;
	}

	//클럽 삭제
	public boolean deleteClub(Long clubId) {
		//클럽장 여부 체크
		Member member = memberService.findMyMemberInfo();
		Club club = validateAdmin(member.getId(), clubId).getClub();
		clubMemberRepository.deleteAllByClubId(clubId);
		clubRepository.delete(club);
		return true;
	}

	//클럽 코드 조회
	@Transactional(readOnly = true)
	public String getClubCode(Long clubId) {
		Member member = memberService.findMyMemberInfo();
		Club club = validateClubAndMember(clubId, member.getId());
		return club.getTeamCode();
	}

	//클럽 id로 멤버 list 조회
	@Transactional(readOnly = true)
	public List<ClubMemberInfoResponse> getClubMembers(Long clubId) {
		//요청자 정보 갖고오기
		Member member = memberService.findMyMemberInfo();
		validateClubAndMember(clubId, member.getId());
		return clubMemberRepository.findAllByClubId(clubId).stream()
			.map(ClubMemberInfoResponse::from)
			.toList();
	}

	//이메일로 멤버 추가
	public boolean addClubMemberByEmail(JoinClubByEmailRequest request, long clubId) {
		validateMember(request.adminId(), clubId);

		//추가할 이메일이 멤버로 존재하는지 체크
		Member newMember = memberRepository.findByEmail(request.email())
			.orElseThrow(() -> new IllegalArgumentException("요청 email의 멤버 데이터 X"));

		validateUniqueMember(newMember.getId(), clubId);

		Club club = validateClub(clubId);
		ClubMember clubMember = ClubMember.createClubMember(newMember, club, 1);
		clubMemberRepository.save(clubMember);
		return true;
	}

	//코드로 멤버 추가
	@Transactional
	public boolean addClubMemberByCode(JoinClubByCodeRequest request, Long clubId) {
		Member newMember = memberRepository.findById(request.memberId())
			.orElseThrow(() -> new IllegalArgumentException("해당 id의 member없음"));

		//참여하려는 id의 클럽이 존재하는지 체크
		Club club = validateClub(clubId);

		if (!club.getTeamCode().equals(request.teamCode())) {
			throw new IllegalArgumentException("팀 코드 일치X");
		}

		ClubMember clubMember = ClubMember.createClubMember(newMember, club, 1);
		clubMemberRepository.save(clubMember);
		return true;

	}

	//그룹의 특정 멤버 데이터 조회
	@Transactional(readOnly = true)
	public ClubMemberInfoResponse getClubMember(Long clubId, Long clubMemberId) {
		Member member = memberService.findMyMemberInfo();
		validateClubAndMember(clubId, member.getId());

		//반환값 때문에 validate 메서드 사용X
		ClubMember clubMember = clubMemberRepository.findById(clubMemberId)
			.orElseThrow(() -> new IllegalArgumentException("해당 클럽 멤버가 존재X"));

		return ClubMemberInfoResponse.from(clubMember);
	}

	//클럽 멤버 정보 수정
	public boolean updateClubMember(Long clubId, Long clubMemberId, UpdateClubMemberRequest request) {
		Member member = memberService.findMyMemberInfo();
		//해당 클럽 존재하고 그 클럽의 멤버 체크
		validateClubAndMember(clubId, member.getId());

		ClubMember clubMember = clubMemberRepository.findById(clubMemberId)
			.orElseThrow(() -> new IllegalArgumentException("클라이언트가 그룹멤버아님"));

		if (!clubMember.getMember().getId().equals(member.getId())) {
			throw new IllegalArgumentException("본인 정보 아님");
		}
		request.nickname().ifPresent(clubMember::setNickname);
		request.clubName().ifPresent(clubMember::setClubName);
		clubMemberRepository.save(clubMember);
		return true;

	}

	//탈퇴
	public boolean leaveClub(Long clubId, Long clubMemberId) {
		Member member = memberService.findMyMemberInfo();
		validateClubAndMember(clubId, member.getId());
		ClubMember clubMember = clubMemberRepository.findById(clubMemberId)
			.orElseThrow(() -> new IllegalArgumentException("클라이언트가 그룹멤버아님"));

		if (!clubMember.getMember().getId().equals(member.getId())) {
			throw new IllegalArgumentException("본인 정보 아님");

		}
		clubMemberRepository.delete(clubMember);
		return true;

	}

	//(클럽장이)강퇴
	public boolean banClubMember(Long clubId, BanClubMemberRequest request) {
		//클라이언트
		Member admin = memberService.findMyMemberInfo();

		//클럽장 체크
		validateAdmin(admin.getId(), clubId);

		//탈퇴시킬 멤버 유효성 체크
		ClubMember out = clubMemberRepository.findByMemberIdAndClubId(request.memberId(), clubId)
			.orElseThrow(() -> new IllegalArgumentException("탈퇴시킬 멤버 id에 해당하는 멤버 없음"));

		clubMemberRepository.delete(out);
		return true;

	}

	////////////////메서드 분리//////////////////////////

	//클럽 id에 해당하는 클럽 존재 체크
	private Club validateClub(Long clubId) {
		return clubRepository.findById(clubId)
			.orElseThrow(() -> new IllegalArgumentException("해당 id의 클럽 존재 X"));
	}

	//클럽 존재 체크 + 클라이언트가 클럽 멤버인지
	private Club validateClubAndMember(Long clubId, Long memberId) {
		//클럽 존재 체크 후
		Club club = validateClub(clubId);
		//클라이언트가 클럽 멤버인지 체크
		if (!clubMemberRepository.existsByMemberIdAndClubId(memberId, clubId)) {
			throw new IllegalArgumentException("해당 클럽의 멤버 아님");
		}
		return club;
	}

	//멤버가 클럽 멤버인지 체크
	private ClubMember validateMember(Long memberId, Long clubId) {
		return clubMemberRepository.findByMemberIdAndClubId(memberId, clubId)
			.orElseThrow(() -> new IllegalArgumentException("클라이언트가 클럽 멤버 아님"));
	}

	//클럽장인지 체크
	private ClubMember validateAdmin(Long memberId, Long clubId) {

		ClubMember clubMember = validateMember(memberId, clubId);
		if (clubMember.getCreatedBy() != 0) {
			throw new IllegalArgumentException("클라이언트가 클럽장 아님");
		}
		return clubMember;
	}

	//이미 클럽 속한 멤버인지 체크
	private void validateUniqueMember(Long memberId, Long clubId) {
		if (clubMemberRepository.existsByMemberIdAndClubId(memberId, clubId)) {
			throw new IllegalArgumentException("클라이언트는 이미 클럽 속해있음");
		}
	}

	//팀코드 생성
	private String generateTeamCode() {
		return TeamCodeGenerator.generateTeamCode();
	}

	//클럽 데이터 + 클럽 멤버 데이터 유틸 메서드
	private List<ClubMemberInfoResponse> getMembersForResponse(Long clubId) {
		return clubMemberRepository.findAllByClubId(clubId).stream()
			.map(ClubMemberInfoResponse::from)
			.toList();
	}

}
