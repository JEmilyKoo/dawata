package com.ssafy.dawata.domain.participant.repository;

import com.ssafy.dawata.domain.live.dto.ParticipantDto;
import com.ssafy.dawata.domain.member.dto.response.AppointmentInfoResponse;
import com.ssafy.dawata.domain.participant.entity.Participant;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ParticipantRepository extends JpaRepository<Participant, Long> {

	Optional<Object> findByClubMemberIdAndAppointmentId(Long id, Long appointmentId);

	@Query(""" 
		SELECT new com.ssafy.dawata.domain.member.dto.response.AppointmentInfoResponse (
			p.clubMember.club.id,
			cm.clubName,
			COUNT(*),
			SUM(CASE WHEN p.dailyStatus = 'P' THEN 1 ELSE 0 END),
		     		SUM(CASE WHEN p.dailyStatus = 'L' THEN 1 ELSE 0 END),
		    SUM(CASE WHEN p.dailyStatus = 'NS' THEN 1 ELSE 0 END)
		)
		FROM Participant p
		JOIN p.clubMember cm
		JOIN cm.member m
		JOIN p.appointment a
		WHERE m.id = :memberId
		GROUP BY p.clubMember.club.id, cm.clubName""")
	List<AppointmentInfoResponse> countByMemberId(@Param("memberId") Long memberId);

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

	@Query("""
			SELECT CASE 
				WHEN EXISTS (SELECT 1 FROM Voter vt WHERE vt.participant.id = :participantId) THEN true 
				ELSE false END 
			FROM Participant p WHERE p.id = :participantId
		""")
	boolean hasVoted(@Param("participantId") Long participantId);

	@Query("SELECT p FROM Participant p " +
		"JOIN  p.clubMember cm " +
		"JOIN cm.member m " +
		"JOIN p.appointment a " +
		"WHERE p.appointment.id = :appointmentId")
	List<Participant> findParticipantsByAppointmentId(Long appointmentId);
}
