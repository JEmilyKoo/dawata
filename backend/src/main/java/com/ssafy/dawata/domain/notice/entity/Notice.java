package com.ssafy.dawata.domain.notice.entity;

import java.time.LocalDateTime;

import com.ssafy.dawata.domain.member.entity.Member;
import com.ssafy.dawata.domain.notice.enums.NoticeType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Notice {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "type", nullable = false)
	@Enumerated(EnumType.ORDINAL)
	private NoticeType noticeType;

	@Column(nullable = false)
	private int messageType;

	@Column(nullable = false)
	private Long referenceId;

	@Column(name = "is_read", nullable = false)
	private boolean read = false;

	@Column(name = "is_deleted", nullable = false)
	private boolean deleted = false;

	@Column(nullable = false)
	private LocalDateTime createdAt = LocalDateTime.now();

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "member_id")
	private Member member;

	@Builder(access = AccessLevel.PRIVATE)
	public Notice(NoticeType noticeType, int messageType, Long referenceId, Member member) {
		this.noticeType = noticeType;
		this.messageType = messageType;
		this.referenceId = referenceId;
		this.member = member;
	}

	public static Notice createNotice(
		NoticeType noticeType,
		int messageType,
		Long referenceId,
		Member member
	) {
		return Notice.builder()
			.noticeType(noticeType)
			.messageType(messageType)
			.referenceId(referenceId)
			.member(member)
			.build();
	}

	public void updateRead(boolean read) {
		this.read = read;
	}

	public void updateDeleted(boolean deleted) {
		this.deleted = deleted;
	}
}
