package com.ssafy.dawata.domain.club.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.dawata.domain.club.entity.Club;

public interface ClubRepository extends JpaRepository<Club,Long> {

	Optional<Club> findById(Long id);

	Optional<Club> findByTeamCode(String teamCode);
}
