package com.ssafy.dawata.domain.routine.service;

import static com.ssafy.dawata.domain.routine.entity.RoutineElement.*;
import static com.ssafy.dawata.domain.routine.entity.RoutineTemplate.*;

import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.dawata.domain.member.repository.MemberRepository;
import com.ssafy.dawata.domain.routine.dto.request.RoutineRequest;
import com.ssafy.dawata.domain.routine.dto.response.RoutineDetailResponse;
import com.ssafy.dawata.domain.routine.dto.response.RoutineTemplateResponse;
import com.ssafy.dawata.domain.routine.entity.RoutineTemplate;
import com.ssafy.dawata.domain.routine.repository.RoutineElementRepository;
import com.ssafy.dawata.domain.routine.repository.RoutineTemplateRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoutineService {
	private final MemberRepository memberRepository;
	private final RoutineTemplateRepository routineTemplateRepository;
	private final RoutineElementRepository routineElementRepository;

	public Slice<RoutineTemplateResponse> findAllRoutines() {
		Long id = 1L;

		return routineTemplateRepository.customFindAllByMemberId(id);
	}

	public RoutineDetailResponse findRoutine(Long routineId) {
		Long id = 1L;

		return RoutineDetailResponse.builder()
			.name(routineTemplateRepository.findById(id)
				.orElseThrow(IllegalArgumentException::new).getName())
			.routineTemplateList(
				routineTemplateRepository.customFindByRoutineId(routineId))
			.build();
	}

	@Transactional
	public void saveRoutine(RoutineRequest routineRequest) {
		Long userId = 1L;

		RoutineTemplate routineTemplate =
			createRoutineTemplate(
				routineRequest.name(),
				memberRepository.getReferenceById(userId));

		RoutineTemplate rt = routineTemplateRepository.save(routineTemplate);

		for (int i = 0; i < routineRequest.elementRequestList().size(); i++) {
			routineElementRepository.save(
				createRoutineElement(
					routineRequest.elementRequestList().get(i).play(),
					routineRequest.elementRequestList().get(i).spendTime(),
					i + 1,
					rt));
		}
	}

	@Transactional
	public void updateRoutine(Long routineId, RoutineRequest routineRequest) {
		RoutineTemplate routineTemplate =
			routineTemplateRepository.findById(routineId)
				.orElseThrow(IllegalArgumentException::new);

		routineElementRepository.deleteAllByRoutineTemplate(routineTemplate);

		for (int i = 0; i < routineRequest.elementRequestList().size(); i++) {
			routineElementRepository.save(
				createRoutineElement(
					routineRequest.elementRequestList().get(i).play(),
					routineRequest.elementRequestList().get(i).spendTime(),
					i + 1,
					routineTemplate));
		}
	}

	@Transactional
	public void deleteRoutine(Long routineId) {
		RoutineTemplate routineTemplate =
			routineTemplateRepository.findById(routineId)
				.orElseThrow(IllegalArgumentException::new);

		routineElementRepository.deleteAllByRoutineTemplate(routineTemplate);
		routineTemplateRepository.deleteById(routineId);
	}
}
