package com.ssafy.dawata.domain.notice.service;

import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.dawata.domain.notice.dto.response.NoticeResponse;
import com.ssafy.dawata.domain.notice.entity.Notice;
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

	public boolean updateNoticeReadState(Long noticeId) {
		Notice notice = noticeRepository.findById(noticeId)
			.orElseThrow(IllegalArgumentException::new);

		notice.updateRead(true);

		return notice.isRead();
	}

	public boolean deleteNotice(Long noticeId) {
		Notice notice = noticeRepository.findById(noticeId)
			.orElseThrow(IllegalArgumentException::new);

		notice.updateDeleted(true);

		return notice.isDeleted();
	}
}
