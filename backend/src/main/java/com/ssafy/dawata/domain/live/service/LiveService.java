package com.ssafy.dawata.domain.live.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.dawata.domain.appointment.repository.AppointmentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LiveService {
	private final AppointmentRepository appointmentRepository;

	public List<Long> findLives(Long memberId) {
		LocalDateTime now = LocalDateTime.now();

		return appointmentRepository.findByScheduledAtInTwoHours(
			memberId,
			now,
			now.plusHours(2)
		);
	}
}
