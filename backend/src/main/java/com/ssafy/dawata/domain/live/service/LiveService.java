package com.ssafy.dawata.domain.live.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.dawata.domain.appointment.repository.AppointmentRepository;
import com.ssafy.dawata.domain.club.repository.ClubMemberRepository;
import com.ssafy.dawata.domain.common.service.RedisService;
import com.ssafy.dawata.domain.common.service.S3Service;
import com.ssafy.dawata.domain.fcm.service.FCMService;
import com.ssafy.dawata.domain.live.dto.ParticipantDto;
import com.ssafy.dawata.domain.live.dto.TMapResponse;
import com.ssafy.dawata.domain.live.dto.request.UrgentRequest;
import com.ssafy.dawata.domain.live.dto.response.LiveDetailResponse;
import com.ssafy.dawata.domain.live.dto.response.LiveParticipantResponse;
import com.ssafy.dawata.domain.live.dto.response.LiveResponse;
import com.ssafy.dawata.domain.live.enums.ArrivalState;
import com.ssafy.dawata.domain.live.enums.RedisKeyCategory;
import com.ssafy.dawata.domain.member.repository.MemberRepository;
import com.ssafy.dawata.domain.photo.enums.EntityCategory;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LiveService {
	private final ClubMemberRepository clubMemberRepository;
	private final AppointmentRepository appointmentRepository;
	private final MemberRepository memberRepository;
	private final FCMService fcmService;
	private final S3Service s3Service;

	private final RedisTemplate<String, Object> redisTemplateForLiveLocation;
	private final RedisTemplate<String, String> redisTemplateForOthers;
	private final RedisService redisService;

	private final SkOpenApiService skOpenApiService;

	private final ObjectMapper objectMapper;

	public List<Long> findLives(Long memberId) {
		LocalDateTime now = LocalDateTime.now();

		/**
		 * 지금부터 2시간 후까지 존재여부 Check
		 * */
		return appointmentRepository.findByScheduledAtInTwoHours(
			memberId,
			now,
			now.plusHours(2)
		);
	}

	/**
	 * 재촉기능
	 * */
	public void postUrgentNotification(Long memberId, UrgentRequest urgentRequest) {
		// 재촉알림 fcm
		fcmService.sendNotification(
			"4",
			"3",
			memberId,
			memberRepository
				.customFindByParticipantId(urgentRequest.targetParticipantId())
				.orElseThrow(() -> new IllegalArgumentException("해당하는 약속 참가자가 없음둥~")));
	}

	/**
	 * Live기능 Detail
	 * */
	public LiveDetailResponse findLiveDetail(Long id, Long appointmentId) {
		List<Long> memberList =
			objectMapper.convertValue(
				redisService.getData(
					redisTemplateForLiveLocation,
					RedisKeyCategory.LIVE_PARTICIPANT_LIST.getKey() + appointmentId),
				new TypeReference<List<Long>>() {
				}
			);
		String[] arrivals = redisService.getData(
			redisTemplateForOthers,
			RedisKeyCategory.VOTE_RESULT.getKey() + appointmentId
		).split(",");

		List<LiveParticipantResponse> participantResponseList = new ArrayList<>();

		for (Long memberId : memberList) {
			ParticipantDto participantDto =
				clubMemberRepository.findByMemberIdToParticipantDto(memberId)
					.orElseThrow(() -> new IllegalArgumentException("참여자가 없습니다."));

			// 위치 2개
			String[] locationArray =
				objectMapper.convertValue(
					redisService.getData(
						redisTemplateForLiveLocation,
						String.format(
							RedisKeyCategory.LIVE_LOCATION.getKey(),
							new Object[] {appointmentId, memberId}
						)
					),
					new TypeReference<String>() {
					}
				).split(",");

			// t map에 길찾기 요청 (걷는 기준)
			try {
				Map<String, Object> json = skOpenApiService.getWalkingRoute(
					Double.parseDouble(locationArray[0]),
					Double.parseDouble(locationArray[1]),
					Double.parseDouble(arrivals[1]),
					Double.parseDouble(arrivals[2])
				);

				TMapResponse tMapResponse =
					objectMapper.convertValue(json, TMapResponse.class);

				if (tMapResponse.getFeatures() != null && !tMapResponse.getFeatures().isEmpty()) {
					//리스트에 추가
					participantResponseList.add(
						LiveParticipantResponse.toResponse(
							participantDto,
							//이미지
							s3Service.generatePresignedUrl(
								participantDto.fileName(),
								"GET",
								EntityCategory.CLUB_MEMBER,
								participantDto.clubMember().getId()
							).toString(),
							Double.parseDouble(locationArray[0]),
							Double.parseDouble(locationArray[1]),
							tMapResponse.getFeatures().get(0).getProperties().getTotalDistance() < 100 ?
								ArrivalState.ARRIVED :
								ArrivalState.NOT_ARRIVED,
							tMapResponse.getFeatures().get(0).getProperties().getTotalTime()
						)
					);
				} else {
					throw new IllegalArgumentException("데이터를 전달할 수 없습니다.");
				}
			} catch (Exception e) {
				throw new IllegalArgumentException("try 중 에러가 났어요");
			}
		}

		//Redis에서 목적지 가져오기
		String[] latLnt = redisService.getData(
			redisTemplateForOthers,
			RedisKeyCategory.VOTE_RESULT.getKey() + appointmentId
		).split(",");

		return LiveDetailResponse.builder()
			.appointmentTime(LocalDateTime.parse(latLnt[0]))
			.latitude(Double.parseDouble(latLnt[1]))
			.longitude(Double.parseDouble(latLnt[2]))
			.participants(participantResponseList)
			.build();
	}
}
