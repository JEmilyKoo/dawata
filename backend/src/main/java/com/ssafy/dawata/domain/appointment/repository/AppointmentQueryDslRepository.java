package com.ssafy.dawata.domain.appointment.repository;

import java.util.List;

import com.ssafy.dawata.domain.appointment.entity.Appointment;

public interface AppointmentQueryDslRepository {

	List<Appointment> findAppointmentsByMemberId(Long memberId, int prevRange, int nextRange, int currentMonth);

	List<Appointment> findAppointmentsByClubId(Long clubId, int prevRange, int nextRange, int currentMonth);


}
