package com.ssafy.dawata.domain.notice.controller;

import org.springframework.data.domain.Slice;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.dawata.domain.common.dto.ApiResponse;
import com.ssafy.dawata.domain.notice.dto.response.NoticeResponse;
import com.ssafy.dawata.domain.notice.service.NoticeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/notices")
@RequiredArgsConstructor
public class NoticeController {

	private final NoticeService noticeService;

	@GetMapping()
	public ResponseEntity<ApiResponse<Slice<NoticeResponse>>> getNotices() {
		return ResponseEntity.ok(ApiResponse.success(noticeService.findNoticeList()));
	}

	@PostMapping("/{noticeId}")
	public ResponseEntity<ApiResponse<Void>> updateNoticeRead(@PathVariable("noticeId") Long noticeId) {
		noticeService.updateNoticeReadState(noticeId);
		return ResponseEntity.ok(ApiResponse.success());
	}

	@DeleteMapping("/{noticeId}")
	public ResponseEntity<ApiResponse<Void>> deleteNotice(@PathVariable("noticeId") Long noticeId) {
		noticeService.deleteNotice(noticeId);
		return ResponseEntity.ok(ApiResponse.success());
	}
}
