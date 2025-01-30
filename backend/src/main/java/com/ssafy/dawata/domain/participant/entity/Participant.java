package com.ssafy.dawata.domain.participant.entity;

import com.ssafy.dawata.domain.appointment.entity.Appointment;
import com.ssafy.dawata.domain.club.entity.ClubMember;
import com.ssafy.dawata.domain.common.enums.Role;
import com.ssafy.dawata.domain.participant.enums.DailyStatus;
import com.ssafy.dawata.domain.participant.enums.DailyStatusConverter;

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

	@Column
	private Boolean isAttending = false;

	@Convert(converter = DailyStatusConverter.class)
	@Column
	private DailyStatus dailyStatus;

	@Enumerated(EnumType.ORDINAL)
	private Role role;

	// -- 생성자 -- //
	@Builder(access = AccessLevel.PRIVATE)
	private Participant(Appointment appointment, ClubMember clubMember, Boolean isAttending, DailyStatus dailyStatus,
		Role role) {
		this.appointment = appointment;
		this.clubMember = clubMember;
		this.isAttending = isAttending;
		this.dailyStatus = dailyStatus;
		this.role = role;
	}

	public static Participant of(
		Appointment appointment,
		ClubMember clubMember,
		boolean isAttending,
		DailyStatus dailyStatus,
		Role role
	) {
		// TODO: 양방향 연관관계가 필요한 경우 여기서 처리 해주기
		return Participant.builder()
			.appointment(appointment)
			.clubMember(clubMember)
			.isAttending(isAttending)
			.dailyStatus(dailyStatus)
			.role(role)
			.build();
	}

	// -- setter -- //
	public void updateIsAttending(Boolean isAttending) {
		this.isAttending = isAttending;
	}
}
