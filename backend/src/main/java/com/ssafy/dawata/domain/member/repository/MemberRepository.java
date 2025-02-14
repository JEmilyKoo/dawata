package com.ssafy.dawata.domain.member.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.dawata.domain.member.entity.Member;

public interface MemberRepository extends JpaRepository<Member, Long> {

	Optional<Member> findByEmail(String email);

	@Query("""
			SELECT m.id
			FROM Member m
				JOIN ClubMember cm ON m.id = cm.member.id
				JOIN Participant p ON cm.id = p.clubMember.id
				JOIN Appointment a ON p.appointment.id = a.id
			WHERE a.id = :appointmentId
		""")
	List<Long> customFindAllByAppointmentId(@Param("appointmentId") Long appointmentId);

	@Query("""
			SELECT m.id
			FROM Member m
				JOIN ClubMember cm ON m.id = cm.member.id
				JOIN Participant p ON cm.id = p.clubMember.id
			WHERE p.id = :participantId
		""")
	Optional<Long> customFindByParticipantId(@Param("participantId") Long participantId);
}
