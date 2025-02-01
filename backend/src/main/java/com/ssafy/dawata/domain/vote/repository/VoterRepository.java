package com.ssafy.dawata.domain.vote.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.dawata.domain.vote.entity.Voter;

public interface VoterRepository extends JpaRepository<Voter, Long> {

	// TODO: 쿼리 최적화 (불필요한 left join 줄이기)
	boolean existsByParticipantIdAndVoteItemId(Long participantId, Long voterId);

	void deleteByParticipantIdAndVoteItemId(Long participantId, Long voterId);

	@Query("SELECT v " +
		"FROM Voter v " +
		"WHERE v.participant.id IN :participantIds")
	List<Voter> findVotersByParticipantIds(@Param("participantIds") List<Long> participantIds);
}
