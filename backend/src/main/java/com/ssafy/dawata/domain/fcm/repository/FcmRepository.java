package com.ssafy.dawata.domain.fcm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ssafy.dawata.domain.fcm.entity.FcmToken;

@Repository
public interface FcmRepository extends JpaRepository<FcmToken, Long> {
	@Query("""
		    SELECT fcm.token
		    FROM FcmToken fcm
		    JOIN Member m ON m.id = fcm.member.id
		    WHERE m.id = :memberId
		""")
	String findTokenUseMember(@Param("memberId") Long id);
}
