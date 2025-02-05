package com.ssafy.dawata.domain.notice.controller;

import org.springframework.data.domain.Slice;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.dawata.domain.common.dto.ApiResponse;
import com.ssafy.dawata.domain.notice.dto.response.NoticeResponse;
import com.ssafy.dawata.domain.notice.service.NoticeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/notices")
@RequiredArgsConstructor
public class NoticeController {

	private final NoticeService noticeService;

	@Operation(summary = "내 모든 알림 조회",
		description = "내 모든 알림을 조회하는 작업을 수행합니다.")
	@GetMapping()
	public ResponseEntity<ApiResponse<Slice<NoticeResponse>>> getNotices() {
		return ResponseEntity.ok(ApiResponse.success(noticeService.findNoticeList()));
	}

	@Operation(summary = "알림 읽기",
		description = "해당 알림을 읽음 상태로 만들어 줍니다.")
	@PostMapping("/{noticeId}")
	public ResponseEntity<ApiResponse<Void>> updateNoticeRead(
		@Parameter(description = "알림 PK ID", example = "1") @PathVariable("noticeId") Long noticeId) {
		noticeService.updateNoticeReadState(noticeId);
		return ResponseEntity.ok(ApiResponse.success());
	}

	@Operation(summary = "알림 삭제",
		description = "해당 알림을 삭제합니다..")
	@DeleteMapping("/{noticeId}")
	public ResponseEntity<ApiResponse<Void>> deleteNotice(
		@Parameter(description = "알림 PK Id", example = "1") @PathVariable("noticeId") Long noticeId) {
		noticeService.deleteNotice(noticeId);
		return ResponseEntity.ok(ApiResponse.success());
	}
}
