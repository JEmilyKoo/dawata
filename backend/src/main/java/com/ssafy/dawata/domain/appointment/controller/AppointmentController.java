package com.ssafy.dawata.domain.appointment.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.dawata.domain.appointment.dto.request.AppointmentWithParticipantsRequest;
import com.ssafy.dawata.domain.appointment.dto.request.UpdateAppointmentHostRequest;
import com.ssafy.dawata.domain.appointment.dto.request.UpdateAppointmentRequest;
import com.ssafy.dawata.domain.appointment.dto.response.AppointmentDetailResponse;
import com.ssafy.dawata.domain.appointment.dto.response.AppointmentPlaceResponse;
import com.ssafy.dawata.domain.appointment.dto.response.AppointmentWithExtraInfoResponse;
import com.ssafy.dawata.domain.appointment.service.AppointmentService;
import com.ssafy.dawata.domain.auth.entity.SecurityMemberDetails;
import com.ssafy.dawata.domain.common.dto.ApiResponse;
import com.ssafy.dawata.domain.participant.dto.request.ParticipantAttendingRequest;
import com.ssafy.dawata.domain.participant.dto.request.ParticipantDailyStatusRequest;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/appointments")
public class AppointmentController {

	private final AppointmentService appointmentService;

	@Operation(summary = "약속 생성", description = "새로운 약속을 생성합니다.")
	@PostMapping
	public ResponseEntity<ApiResponse<?>> createAppointment(
		@AuthenticationPrincipal SecurityMemberDetails memberDetails,
		@RequestBody AppointmentWithParticipantsRequest requestDto
	) {
		appointmentService.createAppointment(requestDto, memberDetails.member().getId());
		return ResponseEntity.ok(
			ApiResponse.success()
		);
	}

	@Operation(
		summary = "약속 리스트 조회",
		description = "특정 클럽의 약속 리스트를 조회합니다. 클럽 아이디가 주어지지 않으면 나의 전체 약속 리스트를 조회합니다."
	)
	@GetMapping
	public ResponseEntity<ApiResponse<List<AppointmentWithExtraInfoResponse>>> getMyAppointmentList(
		@AuthenticationPrincipal SecurityMemberDetails memberDetails,
		@RequestParam(required = false) Optional<Long> clubId,
		@RequestParam(defaultValue = "4") Integer nextRange,
		@RequestParam(defaultValue = "4") Integer prevRange,
		@RequestParam String date
	) {
		int currentYear = Integer.parseInt(date.trim().split("-")[0]);
		int currentMonth = Integer.parseInt(date.trim().split("-")[1]);
		return clubId.map(cId -> ResponseEntity.ok(
				ApiResponse.success(
					appointmentService.findMyAppointmentListByClubId(memberDetails.member().getId(), cId, nextRange,
						prevRange, currentYear, currentMonth))))
			.orElseGet(() -> ResponseEntity.ok(
				ApiResponse.success(
					appointmentService.findMyAllAppointmentList(memberDetails.member().getId(), nextRange,
						prevRange, currentYear, currentMonth))));
	}

	@Operation(summary = "약속 상세 조회", description = "특정 약속의 상세 정보를 조회합니다.")
	@GetMapping("/{appointmentId}")
	public ResponseEntity<ApiResponse<AppointmentDetailResponse>> getAppointmentDetail(
		@AuthenticationPrincipal SecurityMemberDetails memberDetails,
		@PathVariable Long appointmentId
	) {
		return ResponseEntity.ok(
			ApiResponse.success(appointmentService.findAppointmentDetail(appointmentId, memberDetails.member().getId()))
		);
	}

	@Operation(summary = "약속 수정", description = "기존 약속을 수정합니다.")
	@PutMapping("/{appointmentId}")
	public ResponseEntity<ApiResponse<?>> updateAppointment(
		@AuthenticationPrincipal SecurityMemberDetails memberDetails,
		@PathVariable Long appointmentId,
		@RequestBody UpdateAppointmentRequest requestDto
	) {
		appointmentService.updateAppointment(requestDto, memberDetails.member().getId(), appointmentId);
		return ResponseEntity.ok(
			ApiResponse.success()
		);
	}

	@Operation(summary = "약속 삭제", description = "기존 약속을 삭제합니다.")
	@DeleteMapping("/{appointmentId}")
	public ResponseEntity<ApiResponse<?>> deleteAppointment(
		@AuthenticationPrincipal SecurityMemberDetails memberDetails,
		@PathVariable Long appointmentId
	) {
		appointmentService.deleteAppointment(memberDetails.member().getId(), appointmentId);
		return ResponseEntity.ok(
			ApiResponse.success()
		);
	}

	@Operation(summary = "참여자 참석 여부 업데이트", description = "약속 참여자의 참석 여부를 업데이트합니다.")
	@PatchMapping("/{appointmentId}/participants/attending")
	public ResponseEntity<ApiResponse<?>> attendAppointment(
		@AuthenticationPrincipal SecurityMemberDetails memberDetails,
		@PathVariable Long appointmentId,
		@RequestBody ParticipantAttendingRequest requestDto
	) {
		appointmentService.updateParticipantAttending(memberDetails.member().getId(), appointmentId,
			requestDto.isAttending());
		return ResponseEntity.ok(
			ApiResponse.success()
		);
	}

	@Operation(summary = "참여자 출결 상태 업데이트", description = "약속 참여자의 출결 상태를 업데이트합니다.")
	@PatchMapping("/{appointmentId}/participants/daily-status")
	public ResponseEntity<ApiResponse<?>> updateDailyStatus(
		@AuthenticationPrincipal SecurityMemberDetails memberDetails,
		@PathVariable Long appointmentId,
		@RequestBody ParticipantDailyStatusRequest requestDto
	) {
		appointmentService.updateParticipantDailyStatus(memberDetails.member().getId(), appointmentId,
			requestDto.dailyStatus());
		return ResponseEntity.ok(
			ApiResponse.success()
		);
	}

	@Operation(summary = "약속 모임장 업데이트", description = "약속 모임장을 업데이트합니다.")
	@PatchMapping("/{appointmentId}/host")
	public ResponseEntity<ApiResponse<?>> updateAppointmentHost(
		@AuthenticationPrincipal SecurityMemberDetails memberDetails,
		@PathVariable Long appointmentId,
		@RequestBody UpdateAppointmentHostRequest requestDto
	) {
		appointmentService.updateAppointmentHost(requestDto, memberDetails.member().getId(), appointmentId);
		return ResponseEntity.ok(
			ApiResponse.success()
		);
	}

	@Operation(summary = "약속 장소 추천", description = "약속 참가자의 위치를 기반으로 약속 장소를 추천합니다.")
	@GetMapping("/{appointmentId}/place")
	public ResponseEntity<ApiResponse<AppointmentPlaceResponse>> recommendPlace(
		@PathVariable Long appointmentId
	) {
		return ResponseEntity.ok(
			ApiResponse.success(appointmentService.recommendPlace(appointmentId))
		);
	}
}
