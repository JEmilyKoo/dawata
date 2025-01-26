package com.ssafy.dawata.domain.member.entity;

import org.hibernate.annotations.SQLDelete;

import com.ssafy.dawata.domain.common.BaseTimeEntity;

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

	@Column
	private String name;

	@Column
	private boolean isWithdrawn;

	@Builder(access = AccessLevel.PRIVATE)
	public Member(String email, String name, boolean isWithdrawn) {
		this.email = email;
		this.name = name;
		this.isWithdrawn = isWithdrawn;
	}

	public static Member createMember(String email, String name) {
		return Member.builder()
			.email(email)
			.name(name)
			.isWithdrawn(false)
			.build();
	}

	public void updateName(String name) {
		this.name = name;
	}

	public void updateIsWithdrawn(boolean isWithdrawn) {
		this.isWithdrawn = isWithdrawn;
	}

}
