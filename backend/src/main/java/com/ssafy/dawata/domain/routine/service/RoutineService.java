package com.ssafy.dawata.domain.routine.service;

import static com.ssafy.dawata.domain.routine.entity.RoutineElement.createRoutineElement;
import static com.ssafy.dawata.domain.routine.entity.RoutineTemplate.createRoutineTemplate;

import com.ssafy.dawata.domain.member.repository.MemberRepository;
import com.ssafy.dawata.domain.routine.dto.request.RoutineRequest;
import com.ssafy.dawata.domain.routine.dto.response.RoutineDetailResponse;
import com.ssafy.dawata.domain.routine.dto.response.RoutineTemplateResponse;
import com.ssafy.dawata.domain.routine.entity.RoutineTemplate;
import com.ssafy.dawata.domain.routine.repository.RoutineElementRepository;
import com.ssafy.dawata.domain.routine.repository.RoutineTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
            .routineName(routineTemplateRepository.findByIdAndMemberId(routineId, memberId)
                .orElseThrow(IllegalArgumentException::new).getName())
            .playList(
                routineTemplateRepository.customFindByRoutineId(routineId))
            .build();
    }

    @Transactional
    public void saveRoutine(Long memberId, RoutineRequest routineRequest) {
        RoutineTemplate routineTemplate =
            createRoutineTemplate(
                routineRequest.routineName(),
                memberRepository.getReferenceById(memberId));

        RoutineTemplate rt = routineTemplateRepository.save(routineTemplate);

        for (int i = 0; i < routineRequest.playList().size(); i++) {
            routineElementRepository.save(
                createRoutineElement(
                    routineRequest.playList().get(i).playName(),
                    routineRequest.playList().get(i).spendTime(),
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

        routineTemplate.updateName(routineRequest.routineName());
        routineTemplateRepository.save(routineTemplate);

        routineElementRepository.deleteAllByRoutineTemplate(routineTemplate);

        for (int i = 0; i < routineRequest.playList().size(); i++) {
            routineElementRepository.save(
                createRoutineElement(
                    routineRequest.playList().get(i).playName(),
                    routineRequest.playList().get(i).spendTime(),
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
