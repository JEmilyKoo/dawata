package com.ssafy.dawata.domain.notice.repository;

import java.util.List;

import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ssafy.dawata.domain.notice.dto.response.NoticeResponse;
import com.ssafy.dawata.domain.notice.entity.Notice;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {
	// TODO : 이미지 관련 사항 확정 시 IMAGE 작업 진행 예정

	@Query("""
		    SELECT n
		    FROM Notice n
		    JOIN Member m ON n.member = m
		    WHERE n.member.id = :memberId
		    AND n.deleted = false
		""")
	List<Notice> customFindAllByMemberId(@Param("memberId") Long id);
}
