package com.ssafy.dawata.domain.routine.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ssafy.dawata.domain.routine.entity.RoutineElement;

import com.ssafy.dawata.domain.routine.entity.RoutineTemplate;

@Repository
public interface RoutineElementRepository extends JpaRepository<RoutineElement, Long> {
	void deleteAllByRoutineTemplate(RoutineTemplate routineTemplate);

	@Query("SELECT re from RoutineElement re WHERE re.routineTemplate.id = :routineTemplateId")
	List<RoutineElement> findAllByRoutineTemplateId(@Param("routineTemplateId") Long routineTemplateId);
}