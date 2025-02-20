package com.ssafy.dawata.domain.club.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.dawata.domain.club.entity.ClubMember;
import com.ssafy.dawata.domain.live.dto.ParticipantDto;

public interface ClubMemberRepository extends JpaRepository<ClubMember, Long> {

	//클럽 멤버 조회
	List<ClubMember> findAllByClubId(Long clubId);

	//특정 유저가 클럽에 속해있는지 체크
	boolean existsByMemberIdAndClubId(Long memberId, Long clubId);

	//특정 유저가 속한 모든 클럽의 멤버아이디 조회
	List<ClubMember> findAllByMemberId(Long memberId);

	void deleteAllByClubId(Long clubId);

	//멤버 아이디, 클럽 아이디로 해당 클럽에 속하는 클럽 멤버 아이디 존재 시 클럽 멤버 아이디 반환
	@Query("SELECT clubMember FROM ClubMember clubMember WHERE clubMember.member.id = :memberId AND clubMember.club.id = :clubId")
	Optional<ClubMember> findByMemberIdAndClubId(Long memberId, Long clubId);

	//코드로 클럽 찾기
	@Query("SELECT clubMember FROM ClubMember clubMember WHERE clubMember.club.teamCode = :teamCode")
	List<ClubMember> findByTeamCode(@Param("teamCode") String teamCode);

	//memberId 유저가 참여하는 클럽의 모든 멤버 조회 (그룹 info 조회 시 그룹 멤버 함께 반환)
	@Query("SELECT clubMember FROM ClubMember clubMember JOIN FETCH clubMember.club WHERE clubMember.member.id = :memberId")
	List<ClubMember> findAllWithClubByMemberId(@Param("memberId") Long memberId);

	@Query("""
		SELECT new com.ssafy.dawata.domain.live.dto.ParticipantDto (
			cm,
			ph.photoName
		)
		FROM ClubMember cm
			JOIN FETCH cm.member m
			JOIN Photo ph ON ph.entityCategory = 4 AND ph.entityId = m.id
			JOIN Participant p ON cm.id = p.clubMember.id
			JOIN Appointment a ON p.appointment.id = a.id
		WHERE a.id = :appointmentId AND m.id = :memberId
		""")
	Optional<ParticipantDto> findByMemberIdToParticipantDto(
		@Param("appointmentId") Long appointmentId,
		@Param("memberId") Long memberId
	);
}
