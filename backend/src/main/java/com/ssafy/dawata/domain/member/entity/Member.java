package com.ssafy.dawata.domain.member.entity;

import com.ssafy.dawata.domain.common.entity.BaseTimeEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(unique = true, nullable = false)
	private String email;

	@Column(nullable = false)
	private String name;

	@Column(name = "is_withdrawn", nullable = false)
	private boolean withdrawn = false;

	@Builder(access = AccessLevel.PRIVATE)
	public Member(String email, String name, boolean withdrawn) {
		this.email = email;
		this.name = name;
		this.withdrawn = withdrawn;
	}

	private Member(Long id, String email, String name) {
		this.id = id;
		this.email = email;
		this.name = name;
	}

	public static Member createMember(String email, String name) {
		return Member.builder()
			.email(email)
			.name(name)
			.build();
	}

	public static Member createMember(Long id, String email, String name) {
		return new Member(id, email, name);
	}

	public void updateName(String name) {
		this.name = name;
	}

	public void updateIsWithdrawn(boolean withdrawn) {
		this.withdrawn = withdrawn;
	}
}
