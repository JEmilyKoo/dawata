package com.ssafy.dawata.domain.routine.service;

import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.dawata.domain.routine.dto.response.RoutineDetailResponse;
import com.ssafy.dawata.domain.routine.dto.response.RoutineTemplateResponse;
import com.ssafy.dawata.domain.routine.repository.RoutineRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class RoutineService {
	private final RoutineRepository routineRepository;

	@Transactional(readOnly = true)
	public Slice<RoutineTemplateResponse> findAllRoutines() {
		Long id = 1L;

		return routineRepository.customFindAllByMemberId(id);
	}

	@Transactional(readOnly = true)
	public RoutineDetailResponse findRoutine(Long routineId) {
		Long id = 1L;

		return RoutineDetailResponse.builder()
			.name(routineRepository.findById(id)
				.orElseThrow(IllegalArgumentException::new).getName())
			.routineTemplateList(
				routineRepository.customFindByRoutineId(routineId))
			.build();
	}
}
