package com.ssafy.dawata.domain.vote.entity;

import java.util.ArrayList;
import java.util.List;

import com.ssafy.dawata.domain.address.entity.Address;
import com.ssafy.dawata.domain.appointment.entity.Appointment;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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

	@ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
	@JoinColumn(
		name = "address_id",
		referencedColumnName = "id"
	)
	private Address address;

	@ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
	@JoinColumn(
		name = "appointment_id",
		referencedColumnName = "id"
	)
	private Appointment appointment;

	@OneToMany(mappedBy = "voteItem", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Voter> voters = new ArrayList<>();

	@Column
	private String title;

	@Column
	private String category;

	@Column
	private Integer avgDuration;

	@Column
	private String linkUrl;

	@Builder(access = AccessLevel.PRIVATE)
	private VoteItem(Address address, Appointment appointment, String title, String category, Integer avgDuration,
		String linkUrl) {
		this.address = address;
		this.appointment = appointment;
		this.title = title;
		this.category = category;
		this.avgDuration = avgDuration;
		this.linkUrl = linkUrl;
	}

	public static VoteItem of(
		Address address,
		Appointment appointment,
		String title,
		String category,
		Integer avgDuration,
		String linkUrl
	) {
		return new VoteItem(address, appointment, title, category, avgDuration, linkUrl);
	}
}
