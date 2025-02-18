package com.ssafy.dawata.global.jwt;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

public interface RefreshTokenRepository extends CrudRepository<RefreshToken, Long> {

	boolean existsByToken(String refreshToken);

	Optional<RefreshToken> findByToken(String refreshToken);
}