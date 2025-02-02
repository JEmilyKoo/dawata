package com.ssafy.dawata.domain.routine.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.nio.charset.StandardCharsets;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
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
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.ssafy.dawata.domain.common.dto.ApiResponse;
import com.ssafy.dawata.domain.routine.dto.request.RoutineRequest;
import com.ssafy.dawata.domain.routine.dto.response.RoutineDetailResponse;
import com.ssafy.dawata.domain.routine.dto.response.RoutineElementResponse;
import com.ssafy.dawata.domain.routine.dto.response.RoutineTemplateResponse;
import com.ssafy.dawata.domain.routine.service.RoutineService;

@ExtendWith(MockitoExtension.class)
class RoutineControllerTest {
	@Mock
	private RoutineService routineService;

	@InjectMocks
	private RoutineController routineController;

	private MockMvc mockMvc;
	private final ObjectMapper objectMapper =
		new ObjectMapper().registerModule(new JavaTimeModule());

	@BeforeEach
	void setUp() {
		mockMvc = MockMvcBuilders.standaloneSetup(routineController).build();
	}

	@Test
	@DisplayName("내 루틴 모두 조회 - 성공")
	void success_getRoutineList() throws Exception {
		// given
		RoutineTemplateResponse response1 =
			new RoutineTemplateResponse(1L, "response1", 10L);
		RoutineTemplateResponse response2 =
			new RoutineTemplateResponse(2L, "response1", 100L);

		List<RoutineTemplateResponse> noticeResponses = List.of(response1, response2);

		PageRequest pageable = PageRequest.of(0, 10, Sort.by("createdAt").descending());

		Slice<RoutineTemplateResponse> routineTemplateResponseSlice = new SliceImpl<>(noticeResponses, pageable, true);

		//when
		when(routineService.findAllRoutines()).thenReturn(routineTemplateResponseSlice);

		// then
		mockMvc.perform(get("/routines")
				.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isOk())
			.andExpect(result -> {
				JsonNode jsonNode = objectMapper.readTree(result.getResponse().getContentAsString());
				JsonNode contentNode = jsonNode.get("data").get("content");

				assertEquals(response1.name(),
					contentNode.get(0).get("name").asText());
				assertEquals(response1.totalTime(),
					contentNode.get(0).get("totalTime").asLong());
			})
			.andDo(print());
	}

	@Test
	@DisplayName("내 특정 루틴 조회 - 성공")
	void success_getRoutine() throws Exception {
		// given
		RoutineElementResponse response1 =
			new RoutineElementResponse(1L, "eat", 10L, true);
		RoutineElementResponse response2 =
			new RoutineElementResponse(2L, "wake", 30L, true);

		RoutineDetailResponse detailResponse =
			new RoutineDetailResponse("test", List.of(response1, response2));

		//when
		when(routineService.findRoutine(1L)).thenReturn(detailResponse);

		// then
		mockMvc.perform(get("/routines/1")
				.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isOk())
			.andExpect(result -> {
				ApiResponse<RoutineDetailResponse> resultResponse = objectMapper.readValue(
					result.getResponse().getContentAsString()
					, new TypeReference<ApiResponse<RoutineDetailResponse>>() {
					});

				assertEquals(resultResponse.status(), "success");
				assertEquals(
					resultResponse.data().routineTemplateList().size(),
					detailResponse.routineTemplateList().size());
			})
			.andDo(print());
	}

	@Test
	@DisplayName("내 루틴 생성 - 성공")
	void success_createRoutine() throws Exception {
		// given
		RoutineRequest request =
			new RoutineRequest("test", List.of());
		// when
		// then
		mockMvc.perform(post("/routines")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
			.andExpect(status().isOk())
			.andExpect(result -> {
				ApiResponse<Void> resultResponse = objectMapper.readValue(
					result.getResponse().getContentAsString(StandardCharsets.UTF_8),
					new TypeReference<ApiResponse<Void>>() {
					});

				assertEquals(resultResponse.status(), "success");
			})
			.andDo(print());
	}

	@Test
	@DisplayName("내 루틴 수정 - 성공")
	void success_updateRoutine() throws Exception {
		// given
		RoutineRequest request =
			new RoutineRequest("test", List.of());
		// when
		// then
		mockMvc.perform(put("/routines/1")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
			.andExpect(status().isOk())
			.andExpect(result -> {
				ApiResponse<Void> resultResponse = objectMapper.readValue(
					result.getResponse().getContentAsString(StandardCharsets.UTF_8),
					new TypeReference<ApiResponse<Void>>() {
					});

				assertEquals(resultResponse.status(), "success");
			})
			.andDo(print());
	}

	@Test
	@DisplayName("내 루틴 삭제 - 성공")
	void success_deleteRoutine() throws Exception {
		// given
		// when
		// then
		mockMvc.perform(delete("/routines/1")
				.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isOk())
			.andExpect(result -> {
				ApiResponse<Void> resultResponse = objectMapper.readValue(
					result.getResponse().getContentAsString(StandardCharsets.UTF_8),
					new TypeReference<ApiResponse<Void>>() {
					});

				assertEquals(resultResponse.status(), "success");
			})
			.andDo(print());
	}
}