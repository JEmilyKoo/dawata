package com.ssafy.dawata.domain.notice.service;

import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.data.domain.Sort;

import com.ssafy.dawata.domain.notice.dto.response.NoticeResponse;
import com.ssafy.dawata.domain.notice.repository.NoticeRepository;

@ExtendWith(MockitoExtension.class)
class NoticeServiceTest {
	@Mock
	private NoticeRepository noticeRepository;

	@InjectMocks
	private NoticeService noticeService;

	@Test
	@DisplayName("알림 정보 조회 - 성공")
	void success_findNoticeList() {
		// given
		NoticeResponse noticeResponse1 =
			new NoticeResponse(1L, "11", null, false, false, LocalDateTime.now());

		List<NoticeResponse> noticeResponses = List.of(noticeResponse1);

		PageRequest pageable = PageRequest.of(0, 10, Sort.by("createdAt").descending());

		Slice<NoticeResponse> noticeSlice = new SliceImpl<>(noticeResponses, pageable, true);

		// when
		Mockito.when(noticeRepository.customFindAllByMemberId(1L))
			.thenReturn(noticeSlice);

		// then
		Slice<NoticeResponse> responseSlice = noticeService.findNoticeList();

		assertEquals(responseSlice.getContent().size(), 1);
		assertEquals(responseSlice.getContent().get(0).id(), noticeSlice.getContent().get(0).id());
		assertEquals(responseSlice.getContent().get(0).type(),
			noticeSlice.getContent().get(0).type());
		assertEquals(responseSlice.getContent().get(0).read(),
			noticeSlice.getContent().get(0).read());
		assertEquals(responseSlice.getContent().get(0).deleted(),
			noticeSlice.getContent().get(0).deleted());
		assertEquals(responseSlice.getContent().get(0).createdAt(),
			noticeSlice.getContent().get(0).createdAt());
	}
}