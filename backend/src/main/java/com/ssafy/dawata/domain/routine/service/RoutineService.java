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

	public Slice<RoutineTemplateResponse> findAllRoutines(Long memberId) {
		return routineTemplateRepository.customFindAllByMemberId(memberId);
	}

	public RoutineDetailResponse findRoutine(Long memberId, Long routineId) {
		return RoutineDetailResponse.builder()
			.name(routineTemplateRepository.findById(memberId)
				.orElseThrow(IllegalArgumentException::new).getName())
			.routineTemplateList(
				routineTemplateRepository.customFindByRoutineId(routineId))
			.build();
	}

	@Transactional
	public void saveRoutine(Long memberId, RoutineRequest routineRequest) {
		RoutineTemplate routineTemplate =
			createRoutineTemplate(
				routineRequest.name(),
				memberRepository.getReferenceById(memberId));

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
	public void updateRoutine(Long memberId, Long routineId, RoutineRequest routineRequest) {
		RoutineTemplate routineTemplate =
			routineTemplateRepository.findById(routineId)
				.orElseThrow(IllegalArgumentException::new);

		if (routineTemplate.getMember().getId() != memberId) {
			throw new IllegalArgumentException("자신의 루틴이 아닙니다요");
		}

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
	public void deleteRoutine(Long memberId, Long routineId) {
		RoutineTemplate routineTemplate =
			routineTemplateRepository.findById(routineId)
				.orElseThrow(IllegalArgumentException::new);

		if (routineTemplate.getMember().getId() != memberId) {
			throw new IllegalArgumentException("자신의 루틴이 아닙니다요");
		}

		routineElementRepository.deleteAllByRoutineTemplate(routineTemplate);
		routineTemplateRepository.deleteById(routineId);
	}
}
