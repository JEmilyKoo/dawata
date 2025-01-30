package com.ssafy.dawata.domain.vote.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.dawata.domain.vote.entity.Voter;

public interface VoterRepository extends JpaRepository<Voter, Long> {

	// TODO: 쿼리 최적화 (불필요한 left join 줄이기)
	boolean existsByParticipantIdAndVoteItemId(Long participantId, Long voterId);

	void deleteByParticipantIdAndVoteItemId(Long participantId, Long voterId);
}
