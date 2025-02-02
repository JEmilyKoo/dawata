package com.ssafy.dawata.domain.routine.service;

import static com.ssafy.dawata.domain.routine.entity.RoutineTemplate.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.data.domain.Sort;

import com.ssafy.dawata.domain.member.entity.Member;
import com.ssafy.dawata.domain.member.repository.MemberRepository;
import com.ssafy.dawata.domain.routine.dto.request.RoutineElementRequest;
import com.ssafy.dawata.domain.routine.dto.request.RoutineRequest;
import com.ssafy.dawata.domain.routine.dto.response.RoutineDetailResponse;
import com.ssafy.dawata.domain.routine.dto.response.RoutineElementResponse;
import com.ssafy.dawata.domain.routine.dto.response.RoutineTemplateResponse;
import com.ssafy.dawata.domain.routine.entity.RoutineElement;
import com.ssafy.dawata.domain.routine.entity.RoutineTemplate;
import com.ssafy.dawata.domain.routine.repository.RoutineElementRepository;
import com.ssafy.dawata.domain.routine.repository.RoutineTemplateRepository;

@ExtendWith(MockitoExtension.class)
class RoutineServiceTest {
	@Mock
	private RoutineTemplateRepository routineTemplateRepository;
	@Mock
	private RoutineElementRepository routineElementRepository;
	@Mock
	private MemberRepository memberRepository;

	@InjectMocks
	private RoutineService routineService;

	@Test
	@DisplayName("내 모든 루틴 조회 - 성공")
	void success_findAllRoutines() {
		// given
		RoutineTemplateResponse response1 =
			new RoutineTemplateResponse(1L, "response1", 10L);
		RoutineTemplateResponse response2 =
			new RoutineTemplateResponse(2L, "response1", 100L);

		List<RoutineTemplateResponse> noticeResponses = List.of(response1, response2);

		PageRequest pageable = PageRequest.of(0, 10, Sort.by("createdAt").descending());

		Slice<RoutineTemplateResponse> routineTemplateResponseSlice = new SliceImpl<>(noticeResponses, pageable, true);
		// when
		when(routineTemplateRepository.customFindAllByMemberId(1L)).thenReturn(routineTemplateResponseSlice);

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
			new RoutineTemplate("test", null);
		RoutineElementResponse response1 =
			new RoutineElementResponse(1L, "eat", 10L, true);
		RoutineElementResponse response2 =
			new RoutineElementResponse(2L, "wake", 110L, true);
		List<RoutineElementResponse> responseList =
			List.of(response1, response2);

		// when
		when(routineTemplateRepository.findById(userId))
			.thenReturn(Optional.of(routineTemplate));
		when(routineTemplateRepository.customFindByRoutineId(routineId))
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

	@Test
	@DisplayName("루틴 생성 - 성공")
	void success_saveRoutine() {
		// given
		Member member =
			new Member("test@email.com", "tester", false);

		RoutineTemplate routineTemplate =
			createRoutineTemplate(
				"test", member);
		RoutineElementRequest element1 =
			new RoutineElementRequest("eat", 10L);
		RoutineElementRequest element2 =
			new RoutineElementRequest("wake", 20L);
		List<RoutineElementRequest> routineElementList = List.of(element1, element2);

		RoutineRequest request
			= new RoutineRequest("tester", routineElementList);

		// when
		when(memberRepository.getReferenceById(anyLong())).thenReturn(member);
		when(routineTemplateRepository.save(any(RoutineTemplate.class)))
			.thenReturn(routineTemplate);
		when(routineElementRepository.save(any(RoutineElement.class)))
			.thenAnswer(invocation -> invocation.getArgument(0));

		routineService.saveRoutine(request);

		// then
		verify(memberRepository, times(1)).getReferenceById(anyLong());
		verify(routineTemplateRepository, times(1)).save(any(RoutineTemplate.class));
		verify(routineElementRepository, times(2)).save(any(RoutineElement.class));

		ArgumentCaptor<RoutineElement> captor = ArgumentCaptor.forClass(RoutineElement.class);
		verify(routineElementRepository, times(2)).save(captor.capture());

		List<RoutineElement> savedElements = captor.getAllValues();
		assertEquals("eat", savedElements.get(0).getPlay());
		assertEquals(10L, savedElements.get(0).getSpendTime());
		assertEquals("wake", savedElements.get(1).getPlay());
		assertEquals(20L, savedElements.get(1).getSpendTime());
	}

	@Test
	@DisplayName("루틴 수정 - 성공")
	void success_updateRoutine() {
		// given
		Member member =
			new Member("test@email.com", "tester", false);

		RoutineTemplate routineTemplate =
			createRoutineTemplate(
				"test", member);
		RoutineElementRequest element1 =
			new RoutineElementRequest("eat", 10L);
		RoutineElementRequest element2 =
			new RoutineElementRequest("wake", 20L);
		List<RoutineElementRequest> routineElementList = List.of(element1, element2);

		RoutineRequest request
			= new RoutineRequest("tester", routineElementList);

		// when
		when(routineTemplateRepository.findById(anyLong()))
			.thenReturn(Optional.of(routineTemplate));
		doNothing().when(routineElementRepository).deleteAllByRoutineTemplate(any(RoutineTemplate.class));
		when(routineElementRepository.save(any(RoutineElement.class)))
			.thenAnswer(invocation -> invocation.getArgument(0));

		routineService.updateRoutine(1L, request);

		// then
		verify(routineTemplateRepository, times(1))
			.findById(anyLong());
		verify(routineElementRepository, times(1))
			.deleteAllByRoutineTemplate(any(RoutineTemplate.class));
		verify(routineElementRepository, times(2))
			.save(any(RoutineElement.class));

		ArgumentCaptor<RoutineElement> captor = ArgumentCaptor.forClass(RoutineElement.class);
		verify(routineElementRepository, times(2)).save(captor.capture());

		List<RoutineElement> updatedElements = captor.getAllValues();
		assertEquals("eat", updatedElements.get(0).getPlay());
		assertEquals(10L, updatedElements.get(0).getSpendTime());
		assertEquals("wake", updatedElements.get(1).getPlay());
		assertEquals(20L, updatedElements.get(1).getSpendTime());
	}

	@Test
	@DisplayName("루틴 삭제 - 성공")
	void success_deleteRoutine() {
		// given
		Member member =
			new Member("test@email.com", "tester", false);
		RoutineTemplate routineTemplate =
			createRoutineTemplate("test", member);

		RoutineElementRequest element1 =
			new RoutineElementRequest("eat", 10L);
		RoutineElementRequest element2 =
			new RoutineElementRequest("wake", 20L);
		List<RoutineElementRequest> routineElementList = List.of(element1, element2);

		RoutineRequest request
			= new RoutineRequest("tester", routineElementList);

		// when
		when(routineTemplateRepository.findById(anyLong()))
			.thenReturn(Optional.of(routineTemplate));
		doNothing().when(routineElementRepository)
			.deleteAllByRoutineTemplate(routineTemplate);
		doNothing().when(routineTemplateRepository)
			.deleteById(anyLong());

		routineService.deleteRoutine(anyLong());

		// then
		verify(routineTemplateRepository, times(1))
			.findById(anyLong());
		verify(routineElementRepository, times(1))
			.deleteAllByRoutineTemplate(any(RoutineTemplate.class));
		verify(routineTemplateRepository, times(1))
			.deleteById(anyLong());

		ArgumentCaptor<RoutineTemplate> captor =
			ArgumentCaptor.forClass(RoutineTemplate.class);
		verify(routineElementRepository, times(1))
			.deleteAllByRoutineTemplate(captor.capture());

		List<RoutineTemplate> deletedElements = captor.getAllValues();
		assertEquals(deletedElements.get(0).getName(), routineTemplate.getName());
		assertEquals(deletedElements.get(0).getMember().getName(), routineTemplate.getMember().getName());
		assertEquals(deletedElements.get(0).getMember().getEmail(), routineTemplate.getMember().getEmail());
		assertEquals(deletedElements.get(0).getMember().isWithdrawn(), routineTemplate.getMember().isWithdrawn());
	}
}