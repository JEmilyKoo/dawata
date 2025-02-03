package com.ssafy.dawata.domain.participant.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.dawata.domain.participant.entity.Participant;

public interface ParticipantRepository extends JpaRepository<Participant, Long> {

	@Query("SELECT p " +
		"FROM Participant p " +
		"JOIN p.clubMember cm " +
		"JOIN cm.member m " +
		"JOIN p.appointment a " +
		"WHERE m.id = :memberId AND a.id = :appointmentId")
	Optional<Participant> findByMemberIdAndAppointmentId(
		@Param("memberId") Long memberId,
		@Param("appointmentId") Long appointmentId
	);
}
