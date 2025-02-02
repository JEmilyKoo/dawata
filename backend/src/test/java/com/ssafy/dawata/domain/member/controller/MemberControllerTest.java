package com.ssafy.dawata.domain.member.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.ssafy.dawata.domain.common.dto.ApiResponse;
import com.ssafy.dawata.domain.member.dto.request.MemberInfoUpdateRequest;
import com.ssafy.dawata.domain.member.dto.response.MemberInfoResponse;
import com.ssafy.dawata.domain.member.entity.Member;
import com.ssafy.dawata.domain.member.service.MemberService;

@ExtendWith(MockitoExtension.class)
class MemberControllerTest {
	@Mock
	private MemberService memberService;

	@InjectMocks
	private MemberController memberController;

	private MockMvc mockMvc;
	private final ObjectMapper objectMapper =
		new ObjectMapper().registerModule(new JavaTimeModule());
	;

	@BeforeEach
	void setUp() {
		mockMvc = MockMvcBuilders.standaloneSetup(memberController).build();
	}

	@Test
	@DisplayName("회원 정보 조회 - 성공")
	void success_getMyInfo() throws Exception {
		// given
		Member member = new Member("tester@email.com", "tester", false);

		//when
		when(memberService.findMyMemberInfo()).thenReturn(member);

		// then
		mockMvc.perform(get("/members")
				.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isOk())
			.andExpect(result -> {
				ApiResponse<Member> resultMember = objectMapper.readValue(
					result.getResponse().getContentAsString(StandardCharsets.UTF_8),
					new TypeReference<ApiResponse<Member>>() {
					}
				);

				assertEquals(member.getEmail(), resultMember.data().getEmail());
				assertEquals(member.getName(), resultMember.data().getName());
				assertFalse(resultMember.data().isWithdrawn());
			})
			.andDo(print());
	}

	@Test
	@DisplayName("회원의 전체 약속 조회 - 성공")
	void success_getAllMyAppointment() throws Exception {
		// TODO : 약속 service 구현 시 test 작업
		// given
		// when
		// then
	}

	@Test
	@DisplayName("회원 정보 수정 - 성공")
	void success_updateMyInfo() throws Exception {
		// given
		MemberInfoUpdateRequest request =
			new MemberInfoUpdateRequest("update");
		MemberInfoResponse changeMember =
			new MemberInfoResponse("tester@email.com", "update", null, LocalDateTime.now());

		//when
		when(memberService.updateMyInfo(request))
			.thenReturn(changeMember);

		// then
		mockMvc.perform(patch("/members")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
			.andExpect(status().isOk())
			.andExpect(result -> {
				ApiResponse<MemberInfoResponse> resultMember = objectMapper.readValue(
					result.getResponse().getContentAsString(StandardCharsets.UTF_8),
					new TypeReference<ApiResponse<MemberInfoResponse>>() {
					}
				);

				assertEquals(resultMember.status(), "success");
				assertEquals(resultMember.data().email(), changeMember.email());
				assertEquals(resultMember.data().name(), changeMember.name());
				assertEquals(resultMember.data().img(), changeMember.img());
				assertEquals(resultMember.data().createdAt(), changeMember.createdAt());
			})
			.andDo(print());
	}

	@Test
	@DisplayName("회원 정보 수정 - 실패 - valid error")
	void fail_updateMyInfo_nameBlankError() throws Exception {
		// TODO : Validation 관련 논의 후 결정
		// given
		MemberInfoUpdateRequest request =
			new MemberInfoUpdateRequest(" ");
		MemberInfoResponse changeMember =
			new MemberInfoResponse("tester@email.com", "update", null, LocalDateTime.now());

		//when
		// then

	}

	@Test
	@DisplayName("회원 정보 탈퇴 - 성공")
	void success_a() throws Exception {
		// given
		// when
		// then
		mockMvc.perform(delete("/members"))
			.andExpect(status().isOk())
			.andExpect(result -> {
				ApiResponse<Void> resultResponse = objectMapper.readValue(
					result.getResponse().getContentAsString(StandardCharsets.UTF_8),
					new TypeReference<ApiResponse<Void>>() {
					}
				);

				assertEquals(resultResponse.status(), "success");
			})
			.andDo(print());
	}

	@Test
	@DisplayName("회원 이미지 수정 - 성공")
	void success_updateMyImg() throws Exception {
		// TODO : 회원 이미지 구현 시 test 작업
		// given
		// when
		// then
	}
}