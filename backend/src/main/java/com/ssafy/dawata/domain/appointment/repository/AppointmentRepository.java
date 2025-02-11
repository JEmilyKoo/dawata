package com.ssafy.dawata.domain.appointment.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.dawata.domain.appointment.entity.Appointment;
import com.ssafy.dawata.domain.member.dto.response.AppointmentInMonthResponse;

public interface AppointmentRepository extends JpaRepository<Appointment, Long>, AppointmentQueryDslRepository {
	@EntityGraph(attributePaths = {"participants", "participants.clubMember"})
	@Query("SELECT a FROM Appointment a WHERE a.id = :appointmentId")
	Appointment findAppointmentWithParticipantsAndClubId(@Param("appointmentId") Long appointmentId);

	@Query("""
			SELECT new com.ssafy.dawata.domain.member.dto.response.AppointmentInMonthResponse (
				a.name,
				cm.club.name,
				a.scheduledAt,
				a.voteEndTime
			)
			FROM Member m
				JOIN ClubMember cm ON m.id = cm.member.id
				JOIN Participant p ON cm.id = p.clubMember.id
				JOIN Appointment a ON p.appointment.id = a.id
			WHERE m.id = :memberId
				AND FUNCTION('YEAR', a.scheduledAt) = :year
				AND FUNCTION('MONTH', a.scheduledAt) = :month
		"""
	)
	List<AppointmentInMonthResponse> findByScheduledAtInDate(
		@Param("memberId") Long memberId, @Param("year") String year, @Param("month") String month);

	@Query("SELECT DISTINCT a FROM Appointment a " +
		"JOIN FETCH a.participants p " +
		"WHERE a.id = :appointmentId")
	Optional<Appointment> findAppointmentByIdWithParticipant(Long appointmentId);

	@Query("SELECT a FROM Appointment a " +
		"JOIN FETCH a.voteItems p " +
		"WHERE a.id = :appointmentId")
	Optional<Appointment> findAppointmentByIdWithVoteItems(Long appointmentId);

	@Query("""
		SELECT a.id
		FROM Member m
			JOIN ClubMember cm ON m.id = cm.member.id
			JOIN Participant p ON cm.id = p.clubMember.id
			JOIN Appointment a ON p.appointment.id = a.id
		WHERE m.id = :memberId
			AND a.scheduledAt BETWEEN :now AND :twoHoursLater
	""")
	List<Long> findByScheduledAtInTwoHours(
		@Param("memberId") Long memberId,
		@Param("now") LocalDateTime now,
		@Param("twoHoursLater") LocalDateTime twoHoursLater
	);

}
