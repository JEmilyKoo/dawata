package com.ssafy.dawata.domain.routine.repository;

import com.ssafy.dawata.domain.member.entity.Member;
import com.ssafy.dawata.domain.routine.dto.response.RoutineElementResponse;
import com.ssafy.dawata.domain.routine.dto.response.RoutineTemplateResponse;
import com.ssafy.dawata.domain.routine.entity.RoutineTemplate;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RoutineTemplateRepository extends JpaRepository<RoutineTemplate, Long> {

	@Query("""
		    SELECT new com.ssafy.dawata.domain.routine.dto.response.RoutineTemplateResponse(
		        rt.id,
		        rt.name,
		        IFNULL(SUM(re.spendTime), 0L)
		    )
		    FROM RoutineTemplate rt
		    JOIN RoutineElement re ON rt.id = re.routineTemplate.id
		    WHERE rt.member.id = :memberId
		    GROUP BY rt.id, rt.name
		""")
	Slice<RoutineTemplateResponse> customFindAllByMemberId(@Param("memberId") Long id);

	@Query("""
		  SELECT new com.ssafy.dawata.domain.routine.dto.response.RoutineElementResponse (
			  re.id,
			  re.play,
			  re.spendTime
		  )
		  FROM RoutineElement re
		  WHERE re.routineTemplate.id = :routineId
		  ORDER BY re.sequence
		""")
	List<RoutineElementResponse> customFindByRoutineId(@Param("routineId") Long routineId);

	List<RoutineTemplate> findAllByMember(Member member);

	@Query("""
		  SELECT rt
		  FROM RoutineTemplate  rt
		  WHERE rt.id = :routineId AND rt.member.id = :memberId
		""")
	Optional<RoutineTemplate> findByIdAndMemberId(
		@Param("routineId") Long routineId,
		@Param("memberId") Long memberId
	);
}
