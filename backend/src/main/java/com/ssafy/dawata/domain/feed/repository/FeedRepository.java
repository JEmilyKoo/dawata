package com.ssafy.dawata.domain.feed.repository;

import com.ssafy.dawata.domain.appointment.entity.Appointment;
import com.ssafy.dawata.domain.feed.entity.Feed;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedRepository extends JpaRepository<Feed, Long> {

    List<Feed> findByAppointment(Appointment appointment);

    Optional<Feed> findByIdAndAppointmentId(Long feedId, Long appointmentId);


}
