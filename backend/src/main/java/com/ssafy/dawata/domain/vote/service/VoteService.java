package com.ssafy.dawata.domain.vote.service;

import java.time.format.DateTimeFormatter;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.dawata.domain.address.entity.Address;
import com.ssafy.dawata.domain.address.repository.AddressRepository;
import com.ssafy.dawata.domain.appointment.entity.Appointment;
import com.ssafy.dawata.domain.appointment.repository.AppointmentRepository;
import com.ssafy.dawata.domain.participant.entity.Participant;
import com.ssafy.dawata.domain.participant.repository.ParticipantRepository;
import com.ssafy.dawata.domain.tmap.service.TransitService;
import com.ssafy.dawata.domain.vote.dto.request.VoteItemRequest;
import com.ssafy.dawata.domain.vote.dto.request.VotesRequest;
import com.ssafy.dawata.domain.vote.entity.VoteItem;
import com.ssafy.dawata.domain.vote.entity.Voter;
import com.ssafy.dawata.domain.vote.repository.VoteItemRepository;
import com.ssafy.dawata.domain.vote.repository.VoterRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class VoteService {

	private final AddressRepository addressRepository;
	private final VoteItemRepository voteItemRepository;
	private final VoterRepository voterRepository;
	private final ParticipantRepository participantRepository;
	private final AppointmentRepository appointmentRepository;

	private final TransitService transitService;

	@Transactional
	public void createVoteItem(VoteItemRequest requestDto, Long memberId, Long appointmentId) {
		Participant participant = validateAndGetParticipant(memberId, appointmentId);
		Address participantAddress = participant.getMemberAddressMapping().getAddress();

		Address destAddress = Address.of(requestDto.roadAddress(), requestDto.longitude(), requestDto.latitude());
		Address addressEntity = addressRepository.save(destAddress);

		Appointment appointment = appointmentRepository.findById(appointmentId)
			.orElseThrow(() -> new IllegalArgumentException("해당하는 ID의 약속이 존재하지 않습니다."));

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmm");
		int avgDuration = Objects.requireNonNull(
			transitService.requestTransitSubAPI(
				participantAddress.getLongitude(),
				participantAddress.getLatitude(),
				destAddress.getLongitude(),
				destAddress.getLatitude(),
				appointment.getScheduledAt().format(formatter)
			).block()
		).getTotalTime();

		VoteItem voteItem = VoteItem.of(
			addressEntity,
			appointment,
			requestDto.title(),
			requestDto.category(),
			avgDuration,
			requestDto.linkUrl()
		);

		voteItemRepository.save(voteItem);
	}

	@Transactional
	public void voting(VotesRequest requestDto, Long memberId, Long appointmentId) {
		Participant participant = validateAndGetParticipant(memberId, appointmentId);

		requestDto.voteInfos()
			.forEach(voteInfo -> {
				boolean isExist = voterRepository.existsByParticipantIdAndVoteItemId(
					participant.getId(), voteInfo.voteItemId()
				);

				VoteItem voteItem = voteItemRepository.findById(voteInfo.voteItemId())
					.orElseThrow(() -> new IllegalArgumentException("해당하는 ID의 투표 항목이 존재하지 않습니다."));

				if (voteInfo.isSelected() && !isExist) {
					voterRepository.save(Voter.of(participant, voteItem));
					return;
				}

				if (!voteInfo.isSelected() && isExist) {
					voterRepository.deleteByParticipantIdAndVoteItemId(
						participant.getId(), voteInfo.voteItemId()
					);
				}
			});
	}

	private Participant validateAndGetParticipant(Long memberId, Long appointmentId) {
		Participant participant = participantRepository.findByMemberIdAndAppointmentId(memberId, appointmentId)
			.orElseThrow(() -> new IllegalArgumentException("약속에 참여하지 않는 참가자입니다."));

		if (!participant.getIsAttending()) {
			throw new IllegalArgumentException("약속에 불참인 참가자는 변경할 수 없습니다.");
		}

		return participant;
	}
}
