package com.ssafy.dawata.domain.notice.controller;

import org.springframework.data.domain.Slice;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.Mapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.dawata.domain.notice.dto.response.NoticeResponse;
import com.ssafy.dawata.domain.notice.service.NoticeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/notices")
@RequiredArgsConstructor
public class NoticeController {

	private final NoticeService noticeService;

	@GetMapping()
	public Slice<NoticeResponse> getNotices() {
		return noticeService.findNoticeList();
	}

	@PostMapping("/{noticeId}")
	public boolean updateNoticeRead(@PathVariable("noticeId") Long noticeId) {
		return noticeService.updateNoticeReadState(noticeId);
	}

	@DeleteMapping("/{noticeId}")
	public boolean deleteNotice(@PathVariable("noticeId") Long noticeId) {
		return noticeService.deleteNotice(noticeId);
	}
}
