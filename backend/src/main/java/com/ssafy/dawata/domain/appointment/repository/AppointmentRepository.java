package com.ssafy.dawata.domain.appointment.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.dawata.domain.appointment.entity.Appointment;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
}
