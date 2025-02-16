package com.ssafy.dawata.domain.appointment.repository;

import java.time.LocalDateTime;
import java.util.List;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.dawata.domain.appointment.entity.Appointment;
import com.ssafy.dawata.domain.appointment.entity.QAppointment;
import com.ssafy.dawata.domain.club.entity.QClub;
import com.ssafy.dawata.domain.club.entity.QClubMember;
import com.ssafy.dawata.domain.participant.entity.QParticipant;
import com.ssafy.dawata.global.util.DateUtil;

import jakarta.persistence.EntityManager;

public class AppointmentQueryDslRepositoryImpl implements AppointmentQueryDslRepository {

	private final JPAQueryFactory queryFactory;

	public AppointmentQueryDslRepositoryImpl(EntityManager em) {
		this.queryFactory = new JPAQueryFactory(em);
	}

	@Override
	public List<Appointment> findAppointmentsByMemberId(Long memberId, int prevRange, int nextRange, int currentYear,
		int currentMonth) {
		QAppointment appointment = QAppointment.appointment;
		QParticipant participant = QParticipant.participant;
		QClubMember clubMember = QClubMember.clubMember;

		LocalDateTime now = LocalDateTime.now();
		LocalDateTime endDate = now.plusDays(nextRange * 7L);

		return queryFactory
			.selectFrom(appointment)
			.join(appointment.participants, participant)
			.join(participant.clubMember, clubMember)
			.where(
				clubMember.member.id.eq(memberId),
				appointment.scheduledAt.between(now, endDate)
			)
			.fetch();
	}

	@Override
	public List<Appointment> findAppointmentsByClubId(Long clubId, int prevRange, int nextRange, int currentYear,
		int currentMonth) {
		QAppointment appointment = QAppointment.appointment;
		QParticipant participant = QParticipant.participant;
		QClubMember clubMember = QClubMember.clubMember;
		QClub club = QClub.club;

		LocalDateTime now = DateUtil.get15thDayOfMonth(currentYear, currentMonth);
		LocalDateTime startDate = now.minusDays(prevRange * 7L);
		LocalDateTime endDate = now.plusDays(nextRange * 7L);

		return queryFactory
			.selectDistinct(appointment)
			.from(appointment)
			.join(appointment.participants, participant)
			.join(participant.clubMember, clubMember)
			.join(clubMember.club, club)
			.where(
				club.id.eq(clubId),
				appointment.scheduledAt.between(startDate, endDate)
			)
			.fetch();
	}
}
