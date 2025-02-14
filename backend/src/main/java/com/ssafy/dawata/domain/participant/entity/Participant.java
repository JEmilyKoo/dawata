package com.ssafy.dawata.domain.participant.entity;

import java.util.ArrayList;
import java.util.List;

import com.ssafy.dawata.domain.address.entity.MemberAddressMapping;
import com.ssafy.dawata.domain.appointment.entity.Appointment;
import com.ssafy.dawata.domain.club.entity.ClubMember;
import com.ssafy.dawata.domain.common.enums.Role;
import com.ssafy.dawata.domain.participant.enums.DailyStatus;
import com.ssafy.dawata.domain.participant.enums.DailyStatusConverter;
import com.ssafy.dawata.domain.vote.entity.Voter;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Participant {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(
		name = "appointment_id",
		referencedColumnName = "id",
		nullable = false
	)
	private Appointment appointment;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(
		name = "club_member_id",
		referencedColumnName = "id",
		nullable = false
	)
	private ClubMember clubMember;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(
		name = "member_address_id",
		referencedColumnName = "id"
	)
	private MemberAddressMapping memberAddressMapping;

	@OneToMany(mappedBy = "participant", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Voter> voters = new ArrayList<>();

	@Column
	private Boolean isAttending;

	@Convert(converter = DailyStatusConverter.class)
	@Column
	private DailyStatus dailyStatus;

	@Enumerated(EnumType.ORDINAL)
	private Role role;

	// -- 생성자 -- //
	@Builder(access = AccessLevel.PRIVATE)
	private Participant(Appointment appointment, ClubMember clubMember, MemberAddressMapping memberAddressMapping,
		Boolean isAttending, DailyStatus dailyStatus,
		Role role) {
		this.appointment = appointment;
		this.clubMember = clubMember;
		this.memberAddressMapping = memberAddressMapping;
		this.isAttending = isAttending;
		this.dailyStatus = dailyStatus;
		this.role = role;
	}

	public static Participant of(
		Appointment appointment,
		ClubMember clubMember,
		MemberAddressMapping memberAddressMapping,
		boolean isAttending,
		DailyStatus dailyStatus,
		Role role
	) {
		return Participant.builder()
			.appointment(appointment)
			.clubMember(clubMember)
			.memberAddressMapping(memberAddressMapping)
			.isAttending(isAttending)
			.dailyStatus(dailyStatus)
			.role(role)
			.build();
	}

	// -- setter -- //
	public void updateIsAttending(Boolean isAttending) {
		this.isAttending = isAttending;
	}

	public void updateDailyStatus(DailyStatus dailyStatus) {
		this.dailyStatus = dailyStatus;
	}

	public void updateRole(Role role) {
		this.role = role;
	}
}
