package com.ssafy.dawata.domain.address.entity;

import com.ssafy.dawata.domain.member.entity.Member;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "member_address_mapping")
public class MemberAddressMapping {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false)
	private boolean isPrimary = false;

	@ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
	@JoinColumn(name = "address_id", nullable = false)
	private Address address;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "member_id", nullable = false)
	private Member member;

	@Builder
	public MemberAddressMapping(Address address, Member member, String name, boolean isPrimary) {
		this.address = address;
		this.member = member;
		this.name = name;
		this.isPrimary = isPrimary;
	}

	public static MemberAddressMapping createMemberAddressMapping(Address address, Member member, String name,
		boolean isPrimary) {
		return MemberAddressMapping.builder()
			.address(address).member(member).name(name).isPrimary(isPrimary).build();
	}

}
