package com.ssafy.dawata.domain.appointment.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.dawata.domain.appointment.dto.request.AppointmentRequest;
import com.ssafy.dawata.domain.appointment.dto.request.AppointmentWithParticipantsRequest;
import com.ssafy.dawata.domain.appointment.dto.request.UpdateAppointmentRequest;
import com.ssafy.dawata.domain.appointment.dto.response.AppointmentDetailResponse;
import com.ssafy.dawata.domain.appointment.dto.response.AppointmentResponse;
import com.ssafy.dawata.domain.appointment.dto.response.AppointmentWithExtraInfoResponse;
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
import com.ssafy.dawata.domain.vote.entity.VoteItem;
import com.ssafy.dawata.domain.vote.entity.Voter;
import com.ssafy.dawata.domain.vote.repository.VoteItemRepository;
import com.ssafy.dawata.domain.vote.repository.VoterRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class AppointmentService {

	private final AppointmentRepository appointmentRepository;
	private final ClubMemberRepository clubMemberRepository;
	private final MemberRepository memberRepository;
	private final ParticipantRepository participantRepository;
	private final VoteItemRepository voteItemRepository;
	private final VoterRepository voterRepository;

	@Transactional
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

	public List<AppointmentWithExtraInfoResponse> findMyAllAppointmentList(Long memberId, Integer nextRange,
		Integer prevRange) {
		// TODO: nextRange 와 prevRange 로 where 조건 추가하기
		// TODO: participantInfos 에 participant_id -> email 로 변경하기 + profile_url 추가
		List<Appointment> appointments = appointmentRepository.findAppointmentsByMemberId(memberId);

		return makeAppointmentWithExtraInfoResponses(memberId, appointments);
	}

	public List<AppointmentWithExtraInfoResponse> findMyAppointmentListByClubId(Long memberId, Long clubId,
		Integer nextRange,
		Integer prevRange) {
		// TODO: nextRange와 prevRange로 where 조건 추가하기
		// TODO: participantInfos 에 participant_id -> email 로 변경하기 + profile_url 추가
		List<Appointment> appointments = appointmentRepository.findAppointmentsByMemberIdAndClubId(memberId, clubId);

		return makeAppointmentWithExtraInfoResponses(memberId, appointments);
	}

	public AppointmentDetailResponse findAppointmentDetail(Long appointmentId, Long memberId) {
		Appointment appointment = appointmentRepository.findAppointmentWithParticipantsAndClubId(
			appointmentId);

		Participant participant = appointment.getParticipants().stream()
			.filter(p -> p.getClubMember().getMember().getId().equals(memberId))
			.findFirst()
			.orElseThrow(() -> new IllegalArgumentException("내가 속해 있는 약속이 아닙니다!"));

		ClubMember clubMember = participant.getClubMember();

		List<VoteItem> voteItems = voteItemRepository.findVoteItemsWithAddressByAppointmentId(appointmentId);
		List<Voter> voters = voterRepository.findVotersByParticipantIds(
			appointment.getParticipants().stream()
				.map(Participant::getId)
				.toList()
		);

		return AppointmentDetailResponse.of(
			clubMember.getClub().getId(),
			clubMember.getClubName(),
			appointment,
			appointment.getParticipants(),
			makeVoteResponses(voteItems, voters, participant.getId())
		);
	}

	@Transactional
	public void updateAppointment(UpdateAppointmentRequest requestDto, Long memberId, Long appointmentId) {
		Participant participant = participantRepository.findByMemberIdAndAppointmentId(memberId, appointmentId)
			.orElseThrow(() -> new IllegalArgumentException("약속에 참여하지 않는 참가자입니다."));

		if (!participant.getIsAttending()) {
			throw new IllegalArgumentException("약속에 불참인 참가자는 변경할 수 없습니다.");
		}

		Appointment appointment = appointmentRepository.findById(appointmentId)
			.orElseThrow(() -> new IllegalArgumentException("해당하는 약속이 없습니다."));

		requestDto.name().ifPresent(appointment::updateName);
		requestDto.category().ifPresent(appointment::updateCategory);
		requestDto.scheduledAt().ifPresent(appointment::updateScheduledAt);
		requestDto.voteEndTime().ifPresent(appointment::updateVoteEndTime);
	}

	private List<AppointmentWithExtraInfoResponse> makeAppointmentWithExtraInfoResponses(Long memberId,
		List<Appointment> appointments) {
		return appointments.stream()
			.map(appointment -> {
				ClubMember clubMember = appointment.getParticipants()
					.stream()
					.map(Participant::getClubMember)
					.filter(cm -> Objects.equals(cm.getMember().getId(), memberId))
					.findFirst()
					.orElseThrow(() -> new IllegalArgumentException("문제 상황 발생"));

				return AppointmentWithExtraInfoResponse.of(
					clubMember.getClub().getId(),
					clubMember.getClubName(),
					appointment,
					appointment.getParticipants()
				);
			})
			.toList();
	}

	private List<AppointmentDetailResponse.VoteResponse> makeVoteResponses(
		List<VoteItem> voteItems,
		List<Voter> voters,
		Long targetParticipantId
	) {
		long totalCount = voters.isEmpty() ? 1 : voters.size();
		return voteItems.stream().map(vi -> {
				long count = voters.stream()
					.filter(vt -> vt.getVoteItem().getId().equals(vi.getId()))
					.count();

				boolean isSelected = voters.stream()
					.anyMatch(vt -> vt.getVoteItem().getId().equals(vi.getId()) &&
						vt.getParticipant().getId().equals(targetParticipantId));

				double percentage;
				if (count == 0) {
					percentage = 0.0;
				} else {
					percentage = (double)count / totalCount;
				}

				return AppointmentDetailResponse.VoteResponse.of(vi, isSelected, percentage);
			})
			.toList();
	}
}
