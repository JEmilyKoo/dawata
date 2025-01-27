package com.ssafy.dawata.domain.notice.entity;

import java.time.LocalDateTime;

import com.ssafy.dawata.domain.member.entity.Member;
import com.ssafy.dawata.domain.notice.enums.NoticeConverter;
import com.ssafy.dawata.domain.notice.enums.NoticeType;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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

	@Column(name = "type")
	@Convert(converter = NoticeConverter.class)
	private NoticeType noticeType;

	@Column
	private int messageType;

	@Column
	private int referenceId;

	@Column(name = "is_read")
	private boolean read = false;

	@Column(name = "is_deleted")
	private boolean deleted = false;

	@Column
	private LocalDateTime createdAt = LocalDateTime.now();

	@ManyToOne
	private Member member;

	@Builder(access = AccessLevel.PRIVATE)
	public Notice(NoticeType noticeType, int messageType, int referenceId, boolean read, boolean deleted) {
		this.noticeType = noticeType;
		this.messageType = messageType;
		this.referenceId = referenceId;
		this.read = read;
		this.deleted = deleted;
	}

	public static Notice createNotice(NoticeType noticeType, int messageType, int referenceId) {
		return Notice.builder()
			.noticeType(noticeType)
			.messageType(messageType)
			.referenceId(referenceId)
			.build();
	}

	public void updateRead(boolean read) {
		this.read = read;
	}

	public void updateDeleted(boolean deleted) {
		this.deleted = deleted;
	}
}
