package com.ssafy.dawata.domain.club.repository;

import com.ssafy.dawata.domain.club.entity.Club;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClubRepository extends JpaRepository<Club, Long> {

    Optional<Club> findById(Long id);

    Optional<Club> findByTeamCode(String teamCode);

    boolean existsByTeamCode(String teamCode);
}
