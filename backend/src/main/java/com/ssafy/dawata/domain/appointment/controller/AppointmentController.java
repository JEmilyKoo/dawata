package com.ssafy.dawata.domain.appointment.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.dawata.domain.appointment.dto.request.AppointmentWithParticipantsRequest;
import com.ssafy.dawata.domain.appointment.dto.request.UpdateAppointmentRequest;
import com.ssafy.dawata.domain.appointment.dto.response.AppointmentDetailResponse;
import com.ssafy.dawata.domain.appointment.dto.response.AppointmentWithExtraInfoResponse;
import com.ssafy.dawata.domain.appointment.service.AppointmentService;
import com.ssafy.dawata.domain.auth.entity.SecurityMemberDetails;
import com.ssafy.dawata.domain.common.dto.ApiResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/appointments")
public class AppointmentController {

	private final AppointmentService appointmentService;

	@PostMapping
	public void createAppointment(@AuthenticationPrincipal SecurityMemberDetails memberDetails,
		@RequestBody AppointmentWithParticipantsRequest requestDto) {
		// TODO: principal에서 가져오기
		appointmentService.createAppointment(requestDto, 1L);
	}

	@GetMapping
	public ResponseEntity<ApiResponse<List<AppointmentWithExtraInfoResponse>>> getMyAppointmentList(
		@RequestParam(required = false) Optional<Long> clubId,
		@RequestParam(defaultValue = "4") Integer nextRange,
		@RequestParam(defaultValue = "4") Integer prevRange
	) {
		return clubId.map(cId -> ResponseEntity.ok(
				ApiResponse.success(appointmentService.findMyAppointmentListByClubId(1L, cId, nextRange, prevRange))))
			.orElseGet(() -> ResponseEntity.ok(
				ApiResponse.success(appointmentService.findMyAllAppointmentList(1L, nextRange, prevRange))));
	}

	@GetMapping("/{appointmentId}")
	public ResponseEntity<ApiResponse<AppointmentDetailResponse>> getAppointmentDetail(
		@PathVariable Long appointmentId) {
		return ResponseEntity.ok(
			ApiResponse.success(appointmentService.findAppointmentDetail(appointmentId, 1L))
		);
	}

	@PutMapping("/{appointmentId}")
	public ResponseEntity<ApiResponse<?>> updateAppointment(
		@PathVariable Long appointmentId,
		@RequestBody UpdateAppointmentRequest requestDto
	) {
		appointmentService.updateAppointment(requestDto, 1L, appointmentId);
		return ResponseEntity.ok(
			ApiResponse.success()
		);
	}

	@DeleteMapping("/{appointmentId}")
	public ResponseEntity<ApiResponse<?>> deleteAppointment(@PathVariable Long appointmentId) {
		appointmentService.deleteAppointment(1L, appointmentId);
		return ResponseEntity.ok(
			ApiResponse.success()
		);
	}
}
