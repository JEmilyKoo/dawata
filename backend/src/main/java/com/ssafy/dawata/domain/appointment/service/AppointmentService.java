package com.ssafy.dawata.domain.appointment.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.dawata.domain.appointment.dto.request.AppointmentWithParticipantsRequest;
import com.ssafy.dawata.domain.appointment.entity.Appointment;
import com.ssafy.dawata.domain.appointment.repository.AppointmentRepository;
import com.ssafy.dawata.domain.club.entity.ClubMember;
import com.ssafy.dawata.domain.club.repository.ClubMemberRepository;
import com.ssafy.dawata.domain.common.enums.Role;
import com.ssafy.dawata.domain.member.entity.Member;
import com.ssafy.dawata.domain.member.repository.MemberRepository;
import com.ssafy.dawata.domain.participant.entity.Participant;
import com.ssafy.dawata.domain.participant.enums.DailyStatus;
import com.ssafy.dawata.domain.participant.repository.ParticipantRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AppointmentService {

	private final AppointmentRepository appointmentRepository;
	private final ClubMemberRepository clubMemberRepository;
	private final MemberRepository memberRepository;
	private final ParticipantRepository participantRepository;

	public void createAppointment(AppointmentWithParticipantsRequest requestDto, String hostEmail) {
		Appointment appointment = requestDto.toDto().toEntity();
		final Appointment appointmentEntity = appointmentRepository.save(appointment);

		final Member hostMemberEntity = memberRepository.findByEmail(hostEmail)
			.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 member 입니다."));

		requestDto.memberIds().forEach(memberId -> {
			ClubMember clubMemberEntity = clubMemberRepository
				.findByMemberIdAndClubId(memberId, requestDto.clubId())
				.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 club member 입니다."));

			boolean isHostMember = memberId.equals(hostMemberEntity.getId());

			Participant participant = Participant.of(
				appointmentEntity, clubMemberEntity, isHostMember, DailyStatus.LATE,
				isHostMember ? Role.HOST : Role.GUEST
			);

			participantRepository.save(participant);
		});
	}
}
