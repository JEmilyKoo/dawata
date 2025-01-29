package com.ssafy.dawata.domain.routine.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.dawata.domain.routine.entity.RoutineElement;

@Repository
public interface RoutineElementRepository extends JpaRepository<RoutineElement, Long> {
}
