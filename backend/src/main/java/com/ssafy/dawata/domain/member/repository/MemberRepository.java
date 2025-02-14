package com.ssafy.dawata.domain.member.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.dawata.domain.live.dto.MemberLocationDto;
import com.ssafy.dawata.domain.member.dto.response.ClubJoinSearchResponse;
import com.ssafy.dawata.domain.member.dto.response.MemberInfoResponse;
import com.ssafy.dawata.domain.member.entity.Member;

public interface MemberRepository extends JpaRepository<Member, Long> {

	Optional<Member> findByEmail(String email);

	@Query("""
		    SELECT new com.ssafy.dawata.domain.member.dto.response.ClubJoinSearchResponse(
		    	m.id,
		        m.email,
				m.name,
				p.photoName)
		    FROM Member m
		    JOIN Photo p ON p.entityId = m.id
		    WHERE m.email = :email
		    AND p.entityCategory = 1
		""")
	Optional<ClubJoinSearchResponse> customFindByEmail(@Param("email") String email);

	@Query("""
		SELECT new com.ssafy.dawata.domain.live.dto.MemberLocationDto(
			m.id, p.memberAddressMapping.address.latitude, p.memberAddressMapping.address.longitude
		)
		FROM Member m
			JOIN ClubMember cm ON m.id = cm.member.id
			JOIN Participant p ON cm.id = p.clubMember.id
			JOIN Appointment a ON p.appointment.id = a.id
		WHERE a.id = :appointmentId
	""")
	List<MemberLocationDto> customFindAllByAppointmentId(@Param("appointmentId") Long appointmentId);

	@Query("""
			SELECT m.id
			FROM Member m
				JOIN ClubMember cm ON m.id = cm.member.id
				JOIN Participant p ON cm.id = p.clubMember.id
			WHERE p.id = :participantId
		""")
	Optional<Long> customFindByParticipantId(@Param("participantId") Long participantId);
}
