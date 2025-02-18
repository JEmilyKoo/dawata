package com.ssafy.dawata.domain.vote.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.dawata.domain.vote.entity.VoteItem;

public interface VoteItemRepository extends JpaRepository<VoteItem, Long> {
	@Query("SELECT v FROM VoteItem v JOIN FETCH v.address WHERE v.appointment.id = :appointmentId")
	List<VoteItem> findVoteItemsWithAddressByAppointmentId(@Param("appointmentId") Long appointmentId);

	@Query("""
			SELECT v
			FROM VoteItem v
			LEFT JOIN FETCH v.voters voter
			JOIN FETCH v.address a
			WHERE v.appointment.id = :appointmentId
		""")
	List<VoteItem> findMaxCountByAppointmentId(@Param("appointmentId") Long appointmentId);
}
