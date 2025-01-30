package com.ssafy.dawata.domain.vote.entity;

import com.ssafy.dawata.domain.address.entity.Address;
import com.ssafy.dawata.domain.appointment.entity.Appointment;

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
@NoArgsConstructor
public class VoteItem {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(
		name = "address_id",
		referencedColumnName = "id"
	)
	private Address address;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(
		name = "appointment_id",
		referencedColumnName = "id"
	)
	private Appointment appointment;

	@Column
	private String title;

	@Column
	private String category;

	@Column
	private String detail;

	@Column
	private String linkUrl;

	@Builder(access = AccessLevel.PRIVATE)
	private VoteItem(Address address, Appointment appointment, String title, String category, String detail,
		String linkUrl) {
		this.address = address;
		this.appointment = appointment;
		this.title = title;
		this.category = category;
		this.detail = detail;
		this.linkUrl = linkUrl;
	}

	public static VoteItem of(
		Address address,
		Appointment appointment,
		String title,
		String category,
		String detail,
		String linkUrl
	) {
		return new VoteItem(address, appointment, title, category, detail, linkUrl);
	}
}
