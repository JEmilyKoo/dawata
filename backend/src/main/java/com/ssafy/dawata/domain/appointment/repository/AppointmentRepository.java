package com.ssafy.dawata.domain.appointment.repository;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.dawata.domain.appointment.entity.Appointment;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

	@EntityGraph(attributePaths = {"participants", "participants.clubMember",
		"participants.clubMember.club"}, type = EntityGraph.EntityGraphType.FETCH)
	@Query("SELECT a FROM Appointment a " +
		"JOIN a.participants p " +
		"WHERE p.clubMember.member.id = :memberId")
	List<Appointment> findAppointmentsByMemberId(@Param("memberId") Long memberId);

	@EntityGraph(attributePaths = {"participants", "participants.clubMember",
		"participants.clubMember.club"}, type = EntityGraph.EntityGraphType.FETCH)
	@Query("SELECT distinct a FROM Appointment a " +
		"JOIN Participant p ON a.id = p.appointment.id " +
		"JOIN ClubMember cm ON p.clubMember.id = cm.id " +
		"JOIN Club c ON cm.club.id = c.id " +
		"WHERE cm.club.id = :clubId"
	)
	List<Appointment> findAppointmentsByClubId(
		@Param("clubId") Long clubId
	);

	@EntityGraph(attributePaths = {"participants", "participants.clubMember"})
	@Query("SELECT a FROM Appointment a WHERE a.id = :appointmentId")
	Appointment findAppointmentWithParticipantsAndClubId(@Param("appointmentId") Long appointmentId);
}
