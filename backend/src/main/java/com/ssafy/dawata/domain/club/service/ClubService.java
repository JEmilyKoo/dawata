package com.ssafy.dawata.domain.club.service;

import com.ssafy.dawata.domain.club.dto.request.*;
import com.ssafy.dawata.domain.club.dto.response.ClubInfoResponse;
import com.ssafy.dawata.domain.club.dto.response.ClubMemberInfoResponse;
import com.ssafy.dawata.domain.club.entity.Club;
import com.ssafy.dawata.domain.club.entity.ClubMember;
import com.ssafy.dawata.domain.club.repository.ClubMemberRepository;
import com.ssafy.dawata.domain.club.repository.ClubRepository;
import com.ssafy.dawata.domain.common.dto.ApiResponse;
import com.ssafy.dawata.domain.common.service.S3Service;
import com.ssafy.dawata.domain.member.entity.Member;
import com.ssafy.dawata.domain.member.repository.MemberRepository;
import com.ssafy.dawata.domain.photo.entity.Photo;
import com.ssafy.dawata.domain.photo.enums.EntityCategory;
import com.ssafy.dawata.domain.photo.repository.PhotoRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URL;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ClubService {

	private final ClubRepository clubRepository;
	private final MemberRepository memberRepository;
	private final ClubMemberRepository clubMemberRepository;
	private final PhotoRepository photoRepository;

	private final S3Service s3Service;

	//클럽 생성
	@Transactional
	public ApiResponse<?> createClub(CreateClubRequest request, Member member) {
		String teamCode = generateTeamCode();

		Club club = clubRepository.save(Club.createClub(request.name(), request.category(), teamCode));

		ClubMember clubMember = ClubMember.createClubMember(member, club, 0);
		clubMemberRepository.save(clubMember);
		return ApiResponse.success();
	}

	//멤버가 속해있는 특정 클럽 id로 데이터 조회하기
	public ApiResponse<ClubInfoResponse> getClubById(Long clubId, Member member) {

		Club club = validateClubAndMember(clubId, member.getId());
		List<ClubMemberInfoResponse> members = getMembersForResponse(club.getId());

		Photo photo = photoRepository.findByEntityIdAndEntityCategory(clubId, EntityCategory.CLUB)
			.orElse(Photo.createDefaultPhoto(clubId, EntityCategory.CLUB));

		return ApiResponse.success(
			ClubInfoResponse.from(
				club,
				photo.getPhotoName(),
				s3Service.generatePresignedUrl(photo.getPhotoName(), "get", EntityCategory.CLUB, club.getId()),
				members
			)
		);
	}

	//클라이언트의 멤버 정보 가져와서 -> 해당 유저가 속한 모든 그룹의 정보 가져오기
	//Member랑 Club 엔티티가 직접 연결되어 있지 않아서 ClubMember를 거쳐서 데이터를 가져오는데
	// 보통 이렇게 하는 게 맞나요 ..
	public ApiResponse<List<ClubInfoResponse>> getAllClubsByMemberId(Member member) {
		List<ClubMember> clubMembers = clubMemberRepository.findAllWithClubByMemberId(
			member.getId());
		List<ClubInfoResponse> response = clubMembers.stream()
			.map(clubMember -> {
				Club club = clubMember.getClub();
				List<ClubMemberInfoResponse> members = getMembersForResponse(club.getId());
				Photo photo = photoRepository.findByEntityIdAndEntityCategory(club.getId(), EntityCategory.CLUB)
					.orElse(Photo.createDefaultPhoto(club.getId(), EntityCategory.CLUB));
				return ClubInfoResponse.from(
					club,
					photo.getPhotoName(),
					s3Service.generatePresignedUrl(photo.getPhotoName(), "get", EntityCategory.CLUB, club.getId()),
					members
				);
			})
			.collect(Collectors.toList());
		return ApiResponse.success(response);

	}

	//클럽 데이터 수정
	@Transactional
	public ApiResponse<Boolean> updateClub(UpdateClubRequest request, Long clubId, Member member) {
		//해당 멤버가 팀에 속하는지 체크하고, 해당 클럽 id의 클럽 존재 체크
		Club club = validateClubAndMember(clubId, member.getId());
		//클럽장 체크
		validateAdmin(member.getId(), clubId);

		//클럽명 요청 값 존재 시 반영
		request.name().ifPresent(club::updateName);
		//카테고리 요청 값 존재 시 반영
		request.category().ifPresent(club::updateCategory);
		clubRepository.save(club);
		return ApiResponse.success(true);
	}

	//클럽장 교체
	@Transactional
	public ApiResponse<Boolean> updateAdmin(UpdateAdminRequest request, Long clubId, Member member) {
		ClubMember currentAdmin = validateAdmin(member.getId(), clubId);
		ClubMember newAdmin = validateMember(request.newAdminId(), clubId);
		currentAdmin.setRole(1);
		newAdmin.setRole(0);
		clubMemberRepository.save(currentAdmin);
		clubMemberRepository.save(newAdmin);

		return ApiResponse.success(true);
	}

	//클럽 삭제
	@Transactional
	public ApiResponse<Boolean> deleteClub(Long clubId, Member member) {
		//클럽장 여부 체크
		Club club = validateAdmin(member.getId(), clubId).getClub();
		clubMemberRepository.deleteAllByClubId(clubId);
		clubRepository.delete(club);
		return ApiResponse.success(true);
	}

	//클럽 코드 조회
	public ApiResponse<String> getClubCode(Long clubId, Member member) {
		Club club = validateClubAndMember(clubId, member.getId());
		return ApiResponse.success(club.getTeamCode());
	}

	//클럽 id로 멤버 list 조회
	public ApiResponse<List<ClubMemberInfoResponse>> getClubMembers(Long clubId, Member member) {
		//요청자 정보 갖고오기
		validateClubAndMember(clubId, member.getId());
		List<ClubMemberInfoResponse> response = getMembersForResponse(clubId);

		return ApiResponse.success(response);
	}

	//이메일로 멤버 추가
	@Transactional
	public ApiResponse<Boolean> addClubMemberByEmail(JoinClubByEmailRequest request, long clubId, Member member) {
		if (request.emails() == null || request.emails().isEmpty()) {
			throw new IllegalArgumentException("추가할 이메일 리스트가 비어 있습니다.");
		}

		validateMember(member.getId(), clubId);

		for (String email : request.emails()) {
			// 추가할 이메일이 멤버로 존재하는지 체크
			Member newMember = memberRepository.findByEmail(email)
				.orElseThrow(() -> new IllegalArgumentException("요청 email의 멤버 데이터 X"));

			validateUniqueMember(newMember.getId(), clubId);

			Club club = validateClub(clubId);
			ClubMember clubMember = ClubMember.createClubMember(newMember, club, 1);
			clubMemberRepository.save(clubMember);
		}
		return ApiResponse.success(true);
	}

	//코드로 멤버 추가
	@Transactional
	public ApiResponse<Boolean> addClubMemberByCode(JoinClubByCodeRequest request, Long clubId) {
		Member newMember = memberRepository.findById(request.memberId())
			.orElseThrow(() -> new IllegalArgumentException("해당 id의 member없음"));

		//참여하려는 id의 클럽이 존재하는지 체크
		Club club = validateClub(clubId);

		if (!club.getTeamCode().equals(request.teamCode())) {
			throw new IllegalArgumentException("팀 코드 일치X");
		}

		ClubMember clubMember = ClubMember.createClubMember(newMember, club, 1);
		clubMemberRepository.save(clubMember);
		return ApiResponse.success(true);

	}

	//그룹의 특정 멤버 데이터 조회
	public ApiResponse<ClubMemberInfoResponse> getClubMember(Long clubId, Long clubMemberId, Member member) {
		validateClubAndMember(clubId, member.getId());

		//반환값 때문에 validate 메서드 사용X
		ClubMember clubMember = clubMemberRepository.findById(clubMemberId)
			.orElseThrow(() -> new IllegalArgumentException("해당 클럽 멤버가 존재X"));

		Photo photo = photoRepository.findByEntityIdAndEntityCategory(
				clubMember.getMember().getId(),
				EntityCategory.MEMBER
			)
			.orElse(Photo.createDefaultPhoto(clubMember.getMember().getId(), EntityCategory.MEMBER));

		return ApiResponse.success(ClubMemberInfoResponse.from(
				clubMember,
				photo.getPhotoName(),
				s3Service.generatePresignedUrl(
					photo.getPhotoName(),
					"get",
					EntityCategory.MEMBER,
					clubMember.getMember().getId()
				)
			)
		);
	}

	//클럽 멤버 정보 수정
	@Transactional
	public ApiResponse<Boolean> updateClubMember(Long clubId, Long clubMemberId,
		UpdateClubMemberRequest request, Member member) {

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
		return ApiResponse.success(true);

	}

	//탈퇴
	@Transactional
	public ApiResponse<Boolean> leaveClub(Long clubId, Long clubMemberId, Member member) {
		validateClubAndMember(clubId, member.getId());
		ClubMember clubMember = clubMemberRepository.findById(clubMemberId)
			.orElseThrow(() -> new IllegalArgumentException("클라이언트가 그룹멤버아님"));

		if (!clubMember.getMember().getId().equals(member.getId())) {
			throw new IllegalArgumentException("본인 정보 아님");

		}
		clubMemberRepository.delete(clubMember);
		return ApiResponse.success(true);

	}

	//(클럽장이)강퇴
	@Transactional
	public ApiResponse<Boolean> banClubMember(Long clubId, BanClubMemberRequest request, Member admin) {

		//클럽장 체크
		validateAdmin(admin.getId(), clubId);

		//탈퇴시킬 멤버 유효성 체크
		ClubMember out = clubMemberRepository.findByMemberIdAndClubId(request.memberId(), clubId)
			.orElseThrow(() -> new IllegalArgumentException("탈퇴시킬 멤버 id에 해당하는 멤버 없음"));

		clubMemberRepository.delete(out);
		return ApiResponse.success(true);

	}

	//클럽 사진 추가 혹은 수정
	@Transactional
	public URL updateClubPhoto(Long clubId, ClubPhotoRequest request, Member admin) {
		//클럽장 체크
		validateAdmin(admin.getId(), clubId);

		Club club = clubRepository.findById(clubId)
			.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 클럽"));

		return s3Service.generatePresignedUrl(
			request.fileName(),
			"PUT",
			EntityCategory.CLUB,
			admin.getId()
		);
	}

	//사진 조회
	public URL getClubPhoto(Long clubId) {
		Club club = clubRepository.findById(clubId)
			.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 클럽"));

		Photo photo = photoRepository.findByEntityIdAndEntityCategory(clubId, EntityCategory.CLUB)
			.orElseThrow(() -> new IllegalArgumentException("해당 클럽의 사진 없음"));

		return s3Service.generatePresignedUrl(photo.getPhotoName(), "GET", EntityCategory.CLUB, clubId);
	}

	//클럽 사진 삭제
	@Transactional
	public ApiResponse<Boolean> deleteClubPhoto(Long clubId, Member admin) {
		//클럽장 체크
		validateAdmin(admin.getId(), clubId);

		Club club = clubRepository.findById(clubId)
			.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 클럽"));

		photoRepository.findByEntityIdAndEntityCategory(clubId, EntityCategory.CLUB).ifPresent(photoRepository::delete);
		return ApiResponse.success(true);
	}

	/// /////////////메서드 분리//////////////////////////

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
		//        if (clubMember.getRole() != 0) {
		//            throw new IllegalArgumentException("클라이언트가 클럽장 아님");
		//        }
		return clubMember;
	}

	//이미 클럽 속한 멤버인지 체크
	private void validateUniqueMember(Long memberId, Long clubId) {
		if (clubMemberRepository.existsByMemberIdAndClubId(memberId, clubId)) {
			throw new IllegalArgumentException("클라이언트는 이미 클럽 속해있음");
		}
	}

	//팀코드 생성 (중복 체크 추가)
	private String generateTeamCode() {
		String teamCode;
		do {
			teamCode = TeamCodeGenerator.generateTeamCode();
		} while (clubRepository.existsByTeamCode(teamCode));

		return teamCode;
	}

	//클럽 데이터 + 클럽 멤버 데이터 유틸 메서드
	private List<ClubMemberInfoResponse> getMembersForResponse(Long clubId) {
		return clubMemberRepository
			.findAllByClubId(clubId)
			.stream()
			.map(clubMember -> {
				Photo photo = photoRepository.findByEntityIdAndEntityCategory(
						clubMember.getMember().getId(),
						EntityCategory.MEMBER
					)
					.orElse(Photo.createDefaultPhoto(clubMember.getMember().getId(), EntityCategory.MEMBER));
				return ClubMemberInfoResponse.from(
					clubMember,
					photo.getPhotoName(),
					s3Service.generatePresignedUrl(
						photo.getPhotoName(),
						"get",
						EntityCategory.MEMBER,
						clubMember.getMember().getId()
					)
				);
			})
			.toList();
	}

}
