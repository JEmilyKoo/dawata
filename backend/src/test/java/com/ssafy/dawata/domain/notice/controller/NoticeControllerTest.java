package com.ssafy.dawata.domain.notice.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDateTime;
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

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.ssafy.dawata.domain.notice.dto.response.NoticeResponse;
import com.ssafy.dawata.domain.notice.service.NoticeService;

@ExtendWith(MockitoExtension.class)
class NoticeControllerTest {
	@Mock
	private NoticeService noticeService;

	@InjectMocks
	private NoticeController noticeController;

	private MockMvc mockMvc;
	private final ObjectMapper objectMapper =
		new ObjectMapper().registerModule(new JavaTimeModule());
	;

	@BeforeEach
	void setUp() {
		mockMvc = MockMvcBuilders.standaloneSetup(noticeController).build();
	}

	@Test
	@DisplayName("알림 조회 - 성공")
	void success_getMyInfo() throws Exception {
		// given
		NoticeResponse noticeResponse1 =
			new NoticeResponse(1L, "11", null, false, false, LocalDateTime.now());
		NoticeResponse noticeResponse2 =
			new NoticeResponse(2L, "21", null, false, false, LocalDateTime.now());

		List<NoticeResponse> noticeResponses = List.of(noticeResponse1, noticeResponse2);

		PageRequest pageable = PageRequest.of(0, 10, Sort.by("createdAt").descending());

		Slice<NoticeResponse> noticeSlice = new SliceImpl<>(noticeResponses, pageable, true);
		//when
		when(noticeService.findNoticeList()).thenReturn(noticeSlice);

		// then
		mockMvc.perform(get("/notices")
				.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isOk())
			.andExpect(result -> {
				JsonNode jsonNode = objectMapper.readTree(result.getResponse().getContentAsString());
				JsonNode contentNode = jsonNode.get("content");

				assertEquals(noticeResponse1.id(),
					contentNode.get(0).get("id").asLong());
				assertEquals(noticeResponse1.type(),
					contentNode.get(0).get("type").asText());
				assertEquals(noticeResponse1.read(),
					contentNode.get(0).get("read").asBoolean());
				assertEquals(noticeResponse1.deleted(),
					contentNode.get(0).get("deleted").asBoolean());
			})
			.andDo(print());
	}
}