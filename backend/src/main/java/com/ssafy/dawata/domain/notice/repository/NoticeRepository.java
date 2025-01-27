package com.ssafy.dawata.domain.notice.repository;

import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ssafy.dawata.domain.notice.dto.response.NoticeResponse;
import com.ssafy.dawata.domain.notice.entity.Notice;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {
	@Query("""
		    SELECT new com.ssafy.dawata.domain.notice.dto.response.NoticeResponse(
		        n.id, 
		        CONCAT(n.noticeType, '', n.messageType), 
		        n.member, 
		        n.read, 
		        n.deleted, 
		        n.createdAt)
		    FROM Notice n
		    WHERE n.member.id = :memberId 
		    AND n.deleted = false
		""")
	Slice<NoticeResponse> customFindAllByMemberId(@Param("memberId") Long id);
}
