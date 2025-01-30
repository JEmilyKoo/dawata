package com.ssafy.dawata.domain.participant.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.dawata.domain.participant.entity.Participant;

public interface ParticipantRepository extends JpaRepository<Participant, Long> {
	
}
