package com.ssafy.dawata.domain.notice.service;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.dawata.domain.notice.dto.response.NoticeResponse;
import com.ssafy.dawata.domain.notice.repository.NoticeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class NoticeService {
	private final NoticeRepository noticeRepository;

	@Transactional(readOnly = true)
	public Slice<NoticeResponse> findNoticeList() {
		Long id = 1L;

		return noticeRepository.customFindAllByMemberId(id);
	}

	public boolean updateNoticeReadState() {

	}

	public boolean deleteNotice() {
	}
}
