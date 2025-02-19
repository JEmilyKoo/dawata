package com.ssafy.dawata.domain.notice.service;

import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.dawata.domain.member.service.MemberService;
import com.ssafy.dawata.domain.notice.dto.response.NoticeResponse;
import com.ssafy.dawata.domain.notice.entity.Notice;
import com.ssafy.dawata.domain.notice.repository.NoticeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NoticeService {
	private final NoticeRepository noticeRepository;
	private final MemberService memberService;

	public Slice<NoticeResponse> findNoticeList(Long memberId) {
		return new SliceImpl<>(
			noticeRepository.customFindAllByMemberId(memberId)
				.stream()
				.map(notice -> {
					return NoticeResponse.builder()
						.id(notice.getId())
						.type(notice.getNoticeType().name())
						// TODO(고) : 여기가 문제
						.memberInfoResponse(memberService.findMemberInfo(notice.getMember().getId()))
						.read(notice.isRead())
						.createdAt(notice.getCreatedAt())
						.build();
				}).toList()
		);
	}

	@Transactional
	public void updateNoticeReadState(Long memberId, Long noticeId) {
		Notice notice = noticeRepository.findById(noticeId)
			.orElseThrow(IllegalArgumentException::new);

		notice.updateRead(true);
	}

	@Transactional
	public void deleteNotice(Long memberId, Long noticeId) {
		Notice notice = noticeRepository.findById(noticeId)
			.orElseThrow(IllegalArgumentException::new);

		notice.updateDeleted(true);
	}
}
