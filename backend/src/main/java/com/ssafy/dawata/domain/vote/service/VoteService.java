package com.ssafy.dawata.domain.vote.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.dawata.domain.address.entity.Address;
import com.ssafy.dawata.domain.address.repository.AddressRepository;
import com.ssafy.dawata.domain.appointment.entity.Appointment;
import com.ssafy.dawata.domain.appointment.repository.AppointmentRepository;
import com.ssafy.dawata.domain.participant.entity.Participant;
import com.ssafy.dawata.domain.participant.repository.ParticipantRepository;
import com.ssafy.dawata.domain.vote.dto.request.VoteItemRequest;
import com.ssafy.dawata.domain.vote.dto.request.VotesRequest;
import com.ssafy.dawata.domain.vote.entity.VoteItem;
import com.ssafy.dawata.domain.vote.entity.Voter;
import com.ssafy.dawata.domain.vote.repository.VoteItemRepository;
import com.ssafy.dawata.domain.vote.repository.VoterRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class VoteService {

	private final AddressRepository addressRepository;
	private final VoteItemRepository voteItemRepository;
	private final VoterRepository voterRepository;
	private final ParticipantRepository participantRepository;
	private final AppointmentRepository appointmentRepository;

	public void createVoteItem(VoteItemRequest requestDto, Long appointmentId) {
		Address address = Address.of(requestDto.roadAddress(), requestDto.longitude(), requestDto.latitude());
		Address addressEntity = addressRepository.save(address);

		Appointment appointment = appointmentRepository.findById(appointmentId)
			.orElseThrow(() -> new IllegalArgumentException("해당하는 ID의 약속이 존재하지 않습니다."));

		VoteItem voteItem = VoteItem.of(addressEntity, appointment, requestDto.title(), requestDto.category(),
			requestDto.detail(),
			requestDto.linkUrl());

		voteItemRepository.save(voteItem);
	}

	public void voting(VotesRequest requestDto, Long appointmentId) {
		Participant participant = participantRepository.findById(requestDto.participantId())
			.orElseThrow(() -> new IllegalArgumentException("해당하는 ID의 참가자가 존재하지 않습니다."));

		requestDto.voteInfos()
			.forEach(voteInfo -> {
				boolean isExist = voterRepository.existsByParticipantIdAndVoteItemId(
					requestDto.participantId(), voteInfo.voteItemId()
				);

				VoteItem voteItem = voteItemRepository.findById(voteInfo.voteItemId())
					.orElseThrow(() -> new IllegalArgumentException("해당하는 ID의 투표 항목이 존재하지 않습니다."));

				if (voteInfo.isSelected() && !isExist) {
					voterRepository.save(Voter.of(participant, voteItem));
					return;
				}

				if (!voteInfo.isSelected() && isExist) {
					voterRepository.deleteByParticipantIdAndVoteItemId(
						requestDto.participantId(), voteInfo.voteItemId()
					);
				}
			});
	}
}
