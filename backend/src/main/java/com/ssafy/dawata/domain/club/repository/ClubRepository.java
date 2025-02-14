package com.ssafy.dawata.domain.club.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.dawata.domain.club.entity.Club;

public interface ClubRepository extends JpaRepository<Club, Long> {

	Optional<Club> findById(Long id);

	Optional<Club> findByTeamCode(String teamCode);

	boolean existsByTeamCode(String teamCode);

	@Query("SELECT cm.club.id FROM ClubMember cm WHERE cm.member.id = :memberId")
	List<Long> findClubIdsByMemberId(@Param("memberId") Long memberId);
}
