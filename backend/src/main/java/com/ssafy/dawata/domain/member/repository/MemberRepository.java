package com.ssafy.dawata.domain.member.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.dawata.domain.member.dto.response.MemberInfoResponse;
import com.ssafy.dawata.domain.member.entity.Member;

public interface MemberRepository extends JpaRepository<Member, Long> {

	Optional<Member> findByEmail(String email);

	@Query("""
		    SELECT new com.ssafy.dawata.domain.member.dto.response.MemberInfoResponse(
		        m.email,
				m.name, 
				p.photoName, 
				m.createdAt)
		    FROM Member m
		    JOIN Photo p ON p.entityId = m.id
		    WHERE p.entityId = :memberId 
		    AND p.entityCategory = 1
		""")
	Optional<MemberInfoResponse> customFindById(@Param("memberId") Long id);
}
