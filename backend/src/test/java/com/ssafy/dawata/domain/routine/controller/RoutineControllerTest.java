package com.ssafy.dawata.domain.routine.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.*;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfiguration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.web.FilterChainProxy;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.google.monitoring.v3.Service;
import com.ssafy.dawata.domain.auth.entity.SecurityMemberDetails;
import com.ssafy.dawata.domain.auth.handler.CustomOAuth2AuthenticationFailureHandler;
import com.ssafy.dawata.domain.auth.handler.CustomOAuth2AuthenticationSuccessHandler;
import com.ssafy.dawata.domain.auth.service.CustomOAuth2UserService;
import com.ssafy.dawata.domain.common.dto.ApiResponse;
import com.ssafy.dawata.domain.member.entity.Member;
import com.ssafy.dawata.domain.routine.dto.request.RoutineRequest;
import com.ssafy.dawata.domain.routine.dto.response.RoutineDetailResponse;
import com.ssafy.dawata.domain.routine.dto.response.RoutineElementResponse;
import com.ssafy.dawata.domain.routine.dto.response.RoutineTemplateResponse;
import com.ssafy.dawata.domain.routine.service.RoutineService;
import com.ssafy.dawata.global.config.SecurityConfig;
import com.ssafy.dawata.global.cookie.HttpCookieOAuth2AuthorizationRequestRepository;
import com.ssafy.dawata.global.filter.JwtAuthenticationFilter;

@SpringBootTest
@AutoConfigureMockMvc
class RoutineControllerTest {
	@MockBean
	private RoutineService routineService;

	@Autowired
	private MockMvc mockMvc;
	@Autowired
	private WebApplicationContext context;

	private final ObjectMapper objectMapper =
		new ObjectMapper().registerModule(new JavaTimeModule());

	@BeforeEach
	void setUp() {
		mockMvc = MockMvcBuilders
			.webAppContextSetup(context)
			.apply(springSecurity()) // ✅ Security 필터 적용
			.build();
	}

	@Test
	@WithMockUser(username = "testUser", roles = {"USER"})
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
		when(routineService.findAllRoutines(anyLong()))
			.thenReturn(routineTemplateResponseSlice);

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
		when(routineService.findRoutine(anyLong(), anyLong())).thenReturn(detailResponse);

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