package com.ssafy.dawata.domain.routine.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.data.domain.Sort;

import com.ssafy.dawata.domain.routine.dto.response.RoutineDetailResponse;
import com.ssafy.dawata.domain.routine.dto.response.RoutineElementResponse;
import com.ssafy.dawata.domain.routine.dto.response.RoutineTemplateResponse;
import com.ssafy.dawata.domain.routine.entity.RoutineTemplate;
import com.ssafy.dawata.domain.routine.enums.PlayType;
import com.ssafy.dawata.domain.routine.repository.RoutineRepository;

@ExtendWith(MockitoExtension.class)
class RoutineServiceTest {
	@Mock
	private RoutineRepository routineRepository;

	@InjectMocks
	private RoutineService routineService;

	@Test
	@DisplayName("내 모든 루틴 조회 - 성공")
	void success_findAllRoutines() {
		// given
		RoutineTemplateResponse response1 =
			new RoutineTemplateResponse("response1", 10L);
		RoutineTemplateResponse response2 =
			new RoutineTemplateResponse("response1", 100L);

		List<RoutineTemplateResponse> noticeResponses = List.of(response1, response2);

		PageRequest pageable = PageRequest.of(0, 10, Sort.by("createdAt").descending());

		Slice<RoutineTemplateResponse> routineTemplateResponseSlice = new SliceImpl<>(noticeResponses, pageable, true);
		// when
		when(routineRepository.customFindAllByMemberId(1L)).thenReturn(routineTemplateResponseSlice);

		// then
		Slice<RoutineTemplateResponse> routineElementResponses =
			routineService.findAllRoutines();

		assertEquals(routineTemplateResponseSlice.getContent().size(), 2);
		assertEquals(routineTemplateResponseSlice.getContent().get(0).name(),
			routineElementResponses.getContent().get(0).name());
		assertEquals(routineTemplateResponseSlice.getContent().get(0).totalTime(),
			routineElementResponses.getContent().get(0).totalTime());
	}

	@Test
	@DisplayName("내 특정 루틴 조회 - 성공")
	void success_findRoutine() {
		// given
		Long routineId = 1L;
		Long userId = 1L;
		RoutineTemplate routineTemplate =
			new RoutineTemplate("test");
		RoutineElementResponse response1 =
			new RoutineElementResponse(PlayType.EAT, 10L, true);
		RoutineElementResponse response2 =
			new RoutineElementResponse(PlayType.WAKE, 110L, true);
		List<RoutineElementResponse> responseList =
			List.of(response1, response2);

		// when
		when(routineRepository.findById(userId))
			.thenReturn(Optional.of(routineTemplate));
		when(routineRepository.customFindByRoutineId(routineId))
			.thenReturn(responseList);

		// then
		RoutineDetailResponse routineResponse = routineService.findRoutine(routineId);

		assertEquals(routineResponse.name(), routineTemplate.getName());
		assertEquals(routineResponse.routineTemplateList().size(), responseList.size());
		assertEquals(routineResponse.routineTemplateList().get(0).play(),
			responseList.get(0).play());
		assertEquals(routineResponse.routineTemplateList().get(0).spendTime(),
			responseList.get(0).spendTime());
		assertEquals(routineResponse.routineTemplateList().get(0).state(),
			responseList.get(0).state());
	}
}