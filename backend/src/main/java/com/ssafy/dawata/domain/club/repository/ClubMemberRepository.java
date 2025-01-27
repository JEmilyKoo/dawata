package com.ssafy.dawata.domain.club.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.dawata.domain.club.entity.ClubMember;

public interface ClubMemberRepository extends JpaRepository<ClubMember, Long> {
	//클럽장 유일 체크.
	boolean existsByClubIdAndCreatedBy(Long clubId, int createdBy);

	//클럽 멤버 조회
	List<ClubMember> findAllByClubId(Long clubId);

	//특정 유저가 클럽에 속해있는지 체크
	boolean existsByMemberIdAndClubId(Long memberId, Long clubId);

	//코드로 클럽 찾기
	@Query("SELECT clubMember FROM ClubMember clubMember WHERE clubMember.club.teamCode = :teamCode")
	List<ClubMember>findByTeamCode(@Param("teamCode")String teamCode);



}
