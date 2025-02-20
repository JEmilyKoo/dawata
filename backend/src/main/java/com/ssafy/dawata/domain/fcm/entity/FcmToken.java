package com.ssafy.dawata.domain.fcm.entity;

import com.ssafy.dawata.domain.common.entity.BaseTimeEntity;
import com.ssafy.dawata.domain.member.entity.Member;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
public class FcmToken extends BaseTimeEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(unique = true, nullable = false)
	private String token;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "member_id")
	private Member member;

	@Builder(access = AccessLevel.PRIVATE)
	public FcmToken(String token) {
		this.token = token;
	}

	public static FcmToken createToken(String token) {
		return FcmToken.builder()
			.token(token)
			.build();
	}

	public void updateToken(String token) {
		this.token = token;
	}
}
