package com.ssafy.dawata.domain.appointment.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.dawata.domain.address.entity.MemberAddressMapping;
import com.ssafy.dawata.domain.address.repository.MemberAddressMappingRepository;
import com.ssafy.dawata.domain.appointment.dto.request.AppointmentWithParticipantsRequest;
import com.ssafy.dawata.domain.appointment.dto.request.UpdateAppointmentHostRequest;
import com.ssafy.dawata.domain.appointment.dto.request.UpdateAppointmentRequest;
import com.ssafy.dawata.domain.appointment.dto.response.AppointmentDetailResponse;
import com.ssafy.dawata.domain.appointment.dto.response.AppointmentPlaceResponse;
import com.ssafy.dawata.domain.appointment.dto.response.AppointmentWithExtraInfoResponse;
import com.ssafy.dawata.domain.appointment.entity.Appointment;
import com.ssafy.dawata.domain.appointment.repository.AppointmentRepository;
import com.ssafy.dawata.domain.club.entity.Club;
import com.ssafy.dawata.domain.club.entity.ClubMember;
import com.ssafy.dawata.domain.club.repository.ClubMemberRepository;
import com.ssafy.dawata.domain.club.repository.ClubRepository;
import com.ssafy.dawata.domain.common.enums.Role;
import com.ssafy.dawata.domain.common.service.RedisService;
import com.ssafy.dawata.domain.common.service.S3Service;
import com.ssafy.dawata.domain.live.enums.RedisKeyCategory;
import com.ssafy.dawata.domain.member.entity.Member;
import com.ssafy.dawata.domain.member.repository.MemberRepository;
import com.ssafy.dawata.domain.participant.entity.Participant;
import com.ssafy.dawata.domain.participant.enums.DailyStatus;
import com.ssafy.dawata.domain.participant.repository.ParticipantRepository;
import com.ssafy.dawata.domain.photo.entity.Photo;
import com.ssafy.dawata.domain.photo.enums.EntityCategory;
import com.ssafy.dawata.domain.photo.repository.PhotoRepository;
import com.ssafy.dawata.domain.vote.entity.VoteItem;
import com.ssafy.dawata.domain.vote.entity.Voter;
import com.ssafy.dawata.domain.vote.enums.VoteStatus;
import com.ssafy.dawata.domain.vote.repository.VoteItemRepository;
import com.ssafy.dawata.domain.vote.repository.VoterRepository;
import com.ssafy.dawata.global.util.GeoMidpointUtil;

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
	private final PhotoRepository photoRepository;
	private final MemberAddressMappingRepository memberAddressMappingRepository;
	private final ClubRepository clubRepository;

	private final RedisTemplate<String, String> redisTemplateForOthers;
	private final RedisService redisService;
	private final S3Service s3Service;

	@Transactional
	public void createAppointment(AppointmentWithParticipantsRequest requestDto, Long memberId) {
		Appointment appointment = requestDto.toDto().toEntity();
		final Appointment appointmentEntity = appointmentRepository.save(appointment);

		final Member hostMemberEntity = memberRepository.findById(memberId)
			.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 member 입니다."));

		requestDto.memberIds().forEach(mId -> {
			ClubMember clubMemberEntity = clubMemberRepository
				.findByMemberIdAndClubId(mId, requestDto.clubId())
				.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 club member 입니다."));

			boolean isHostMember = mId.equals(hostMemberEntity.getId());

			MemberAddressMapping memberAddressMapping = memberAddressMappingRepository.findByMemberId(mId)
				.stream()
				.filter(MemberAddressMapping::isPrimary)
				.findFirst()
				.orElseThrow(() -> new IllegalArgumentException("대표 주소가 없는 멤버입니다."));

			Participant participant = Participant.of(
				appointmentEntity, clubMemberEntity, memberAddressMapping, true, DailyStatus.UNKNOWN,
				isHostMember ? Role.HOST : Role.GUEST
			);

			participantRepository.save(participant);
		});

		// redis에 vote 만료시간으로 in
		System.out.println(redisService.getExpirationTime(appointmentEntity.getVoteEndTime(), LocalDateTime.now()));
		redisService.saveDataUseTTL(
			redisTemplateForOthers,
			RedisKeyCategory.APPOINTMENT_VOTE.getKey() + appointmentEntity.getId(),
			"",
			redisService.getExpirationTime(appointmentEntity.getVoteEndTime(), LocalDateTime.now())
		);
	}

	public List<AppointmentWithExtraInfoResponse> findMyAllAppointmentList(
		Long memberId,
		Integer nextRange,
		Integer prevRange,
		int currentYear,
		int currentMonth

	) {

		List<Long> clubIds = clubRepository.findClubIdsByMemberId(memberId);

		LocalDateTime firstDayOfMonth = LocalDateTime.of(currentYear, currentMonth, 15, 0, 0);

		LocalDateTime startDate = firstDayOfMonth.minusWeeks(prevRange);
		LocalDateTime endDate = firstDayOfMonth.plusWeeks(nextRange);
		List<Appointment> appointments = appointmentRepository.findAppointmentsByClubIds(
			clubIds,
			startDate,
			endDate
		);

		return makeAppointmentWithExtraInfoResponses(memberId, appointments);
	}

	public List<AppointmentWithExtraInfoResponse> findMyAppointmentListByClubId(
		Long memberId,
		Long clubId,
		Integer nextRange,
		Integer prevRange,
		int currentYear,
		int currentMonth
	) {
		List<Appointment> appointments = appointmentRepository.findAppointmentsByClubId(
			clubId,
			prevRange,
			nextRange,
			currentYear,
			currentMonth
		);

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
		Club club = clubMember.getClub();
		Photo clubPhoto = photoRepository.findByEntityIdAndEntityCategory(club.getId(), EntityCategory.CLUB)
			.orElse(Photo.createDefaultPhoto(club.getId(), EntityCategory.CLUB));

		List<VoteItem> voteItems = voteItemRepository.findVoteItemsWithAddressByAppointmentId(appointmentId);
		List<Voter> voters = voterRepository.findVotersByParticipantIds(
			appointment.getParticipants().stream()
				.map(Participant::getId)
				.toList()
		);

		List<AppointmentDetailResponse.ParticipantResponse> participantResponses = appointment.getParticipants()
			.stream()
			.map(p -> {
				ClubMember cm = p.getClubMember();
				Photo photo = photoRepository.findByEntityIdAndEntityCategory(cm.getMember().getId(),
						EntityCategory.MEMBER)
					.orElse(Photo.createDefaultPhoto(cm.getMember().getId(), EntityCategory.MEMBER));
				return AppointmentDetailResponse.ParticipantResponse.of(
					p,
					cm.getMember().getId(),
					cm.getNickname(),
					s3Service.generatePresignedUrl(
						photo.getPhotoName(),
						"get",
						EntityCategory.MEMBER,
						cm.getMember().getId()
					)
				);
			})
			.toList();

		return AppointmentDetailResponse.of(
			clubMember.getClub().getId(),
			clubMember.getClubName(),
			s3Service.generatePresignedUrl(
				clubPhoto.getPhotoName(),
				"get",
				EntityCategory.CLUB,
				club.getId()
			),
			appointment,
			participantResponses,
			makeVoteResponses(voteItems, voters, participant.getId())
		);
	}

	@Transactional
	public void updateAppointment(UpdateAppointmentRequest requestDto, Long memberId, Long appointmentId) {
		validateParticipant(memberId, appointmentId);

		Appointment appointment = appointmentRepository.findById(appointmentId)
			.orElseThrow(() -> new IllegalArgumentException("해당하는 약속이 없습니다."));

		if (requestDto.voteEndTime().isPresent()) {
			// redis에 만료시간으로 in
			redisService.updateDataUseTTL(
				redisTemplateForOthers,
				RedisKeyCategory.APPOINTMENT_VOTE.getKey() + appointmentId,
				redisService.getExpirationTime(
					requestDto.voteEndTime().orElseThrow(
						() -> new IllegalArgumentException("투표 수정 데이터가 존재하지 않습니다.")),
					LocalDateTime.now()
				)
			);
		}

		requestDto.name().ifPresent(appointment::updateName);
		requestDto.category().ifPresent(appointment::updateCategory);
		requestDto.scheduledAt().ifPresent(appointment::updateScheduledAt);
		requestDto.voteEndTime().ifPresent(appointment::updateVoteEndTime);
	}

	@Transactional
	public void deleteAppointment(Long memberId, Long appointmentId) {
		validateParticipant(memberId, appointmentId);

		Appointment appointment = appointmentRepository.findAppointmentByIdWithParticipant(appointmentId)
			.orElseThrow(() -> new IllegalArgumentException("해당하는 약속이 없습니다."));

		// redis에서 해당 id를 key 데이터 삭제
		redisService.deleteData(
			redisTemplateForOthers,
			RedisKeyCategory.APPOINTMENT_VOTE.getKey() + appointmentId);

		appointmentRepository.findAppointmentByIdWithVoteItems(appointmentId)
			.ifPresentOrElse(
				apt -> voteItemRepository.deleteAll(apt.getVoteItems()),
				() -> appointmentRepository.delete(appointment)
			);
	}

	private void validateParticipant(Long memberId, Long appointmentId) {
		Participant participant = participantRepository.findByMemberIdAndAppointmentId(memberId, appointmentId)
			.orElseThrow(() -> new IllegalArgumentException("약속에 참여하지 않는 참가자입니다."));

		if (!participant.getIsAttending()) {
			throw new IllegalArgumentException("약속에 불참인 참가자는 변경할 수 없습니다.");
		}
	}

	@Transactional
	public void updateParticipantAttending(Long memberId, Long appointmentId, boolean isAttending) {
		Participant participant = participantRepository.findByMemberIdAndAppointmentId(memberId, appointmentId)
			.orElseThrow(() -> new IllegalArgumentException("약속에 참여하지 않는 참가자입니다."));

		participant.updateIsAttending(isAttending);
	}

	@Transactional
	public void updateParticipantDailyStatus(Long memberId, Long appointmentId, DailyStatus dailyStatus) {
		Participant participant = participantRepository.findByMemberIdAndAppointmentId(memberId, appointmentId)
			.orElseThrow(() -> new IllegalArgumentException("약속에 참여하지 않는 참가자입니다."));

		participant.updateDailyStatus(dailyStatus);
	}

	@Transactional
	public void updateAppointmentHost(UpdateAppointmentHostRequest requestDto, Long memberId, Long appointmentId) {
		validateIsHost(memberId, appointmentId);

		Participant originalHost = participantRepository.findById(requestDto.oriHost().participantId())
			.orElseThrow(() -> new IllegalArgumentException("해당하는 참가자가 없습니다."));

		Participant newHost = participantRepository.findById(requestDto.newHost().participantId())
			.orElseThrow(() -> new IllegalArgumentException("해당하는 참가자가 없습니다."));

		originalHost.updateRole(Role.GUEST);
		newHost.updateRole(Role.HOST);
	}

	private void validateIsHost(Long memberId, Long appointmentId) {
		Participant participant = participantRepository.findByMemberIdAndAppointmentId(memberId, appointmentId)
			.orElseThrow(() -> new IllegalArgumentException("약속에 참여하지 않는 참가자입니다."));

		if (participant.getRole() != Role.HOST) {
			throw new IllegalArgumentException("약속의 모임장이 아닙니다.");
		}
	}

	public AppointmentPlaceResponse recommendPlace(Long appointmentId) {
		List<Participant> participants = participantRepository.findParticipantsByAppointmentId(appointmentId);

		// TODO: 추천 알고리즘 구현하기
		double[] point = GeoMidpointUtil.getMidpoint();

		List<AppointmentPlaceResponse.ParticipantInfo> participantInfos = participants.stream()
			.map(participant -> {
				ClubMember clubMember = participant.getClubMember();
				Photo photo = photoRepository
					.findByEntityIdAndEntityCategory(
						clubMember.getMember().getId(), EntityCategory.MEMBER
					)
					.orElse(Photo.createDefaultPhoto(clubMember.getMember().getId(), EntityCategory.MEMBER));

				return AppointmentPlaceResponse.ParticipantInfo.of(
					clubMember.getMember().getId(),
					participant.getId(),
					clubMember.getNickname(),
					s3Service.generatePresignedUrl(
						photo.getPhotoName(),
						"get",
						EntityCategory.MEMBER,
						clubMember.getMember().getId()
					),
					(int)(Math.random() * 11) + 30
				);
			})
			.toList();

		return AppointmentPlaceResponse.of(point[0], point[1], participantInfos);
	}

	private List<AppointmentWithExtraInfoResponse> makeAppointmentWithExtraInfoResponses(Long memberId,
		List<Appointment> appointments) {
		return appointments.stream()
			.map(appointment -> {
				Optional<Participant> participant = appointment.getParticipants()
					.stream()
					.filter(p -> p.getClubMember().getMember().getId().equals(memberId))
					.findAny();

				ClubMember targetClubMember = participant.orElseGet(() -> appointment.getParticipants()
						.stream()
						.findAny()
						.orElseThrow(() -> new IllegalArgumentException("약속에 참여하는 참가자가 없습니다.")))
					.getClubMember();

				String clubName =
					participant.isPresent() ? targetClubMember.getClubName() : targetClubMember.getClub().getName();

				Club targetClub = targetClubMember.getClub();

				Photo clubPhoto = photoRepository.findByEntityIdAndEntityCategory(targetClub.getId(),
						EntityCategory.CLUB)
					.orElse(Photo.createDefaultPhoto(targetClub.getId(), EntityCategory.CLUB));

				List<AppointmentWithExtraInfoResponse.ParticipantResponse> participantResponses = appointment.getParticipants()
					.stream()
					.map(p -> {
						ClubMember cm = p.getClubMember();
						Photo photo = photoRepository.findByEntityIdAndEntityCategory(
								cm.getMember().getId(),
								EntityCategory.MEMBER
							)
							.orElse(Photo.createDefaultPhoto(cm.getMember().getId(), EntityCategory.MEMBER));
						return AppointmentWithExtraInfoResponse.ParticipantResponse.of(
							p,
							photo.getPhotoName(),
							s3Service.generatePresignedUrl(
								photo.getPhotoName(),
								"get",
								EntityCategory.MEMBER,
								cm.getMember().getId()
							)
						);
					})
					.toList();

				// Vote Status 로직 추가하기
				VoteStatus voteStatus = VoteStatus.NOT_SELECTED;

				if (participant.isEmpty()) {
					voteStatus = VoteStatus.NOT_PARTICIPANT;
				} else if (appointment.getVoteEndTime().isBefore(LocalDateTime.now())) {
					voteStatus = VoteStatus.EXPIRED;
				} else if (participantRepository.hasVoted(participant.get().getId())) {
					voteStatus = VoteStatus.SELECTED;
				}

				return AppointmentWithExtraInfoResponse.of(
					targetClub.getId(),
					clubName,
					s3Service.generatePresignedUrl(
						clubPhoto.getPhotoName(),
						"get",
						EntityCategory.CLUB,
						targetClub.getId()
					),
					appointment,
					participantResponses,
					voteStatus
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
