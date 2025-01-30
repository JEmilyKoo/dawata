package com.ssafy.dawata.domain.appointment.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.dawata.domain.appointment.dto.request.AppointmentWithParticipantsRequest;
import com.ssafy.dawata.domain.appointment.service.AppointmentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/appointments")
public class AppointmentController {

	private final AppointmentService appointmentService;

	@PostMapping
	public void createAppointment(@RequestBody AppointmentWithParticipantsRequest requestDto) {
		// TODO: principal에서 가져오기
		appointmentService.createAppointment(requestDto, "host@email.com");
	}

}
