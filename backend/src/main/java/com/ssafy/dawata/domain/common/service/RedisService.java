package com.ssafy.dawata.domain.common.service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RedisService {
	private static final int TWO_HOURS = 60 * 60 * 2;

	/**
	 * redis 저장 (만료시간 0)
	 * */
	public <T> void saveDataUseTTL(
		RedisTemplate<String, T> redisTemplate,
		String key, T value,
		long expirationTime
	) {
		try {
			redisTemplate.opsForValue().set(key, value, expirationTime, TimeUnit.SECONDS);
		} catch (RuntimeException e) {
			throw new IllegalArgumentException(e);
		}
	}

	/**
	 * redis 저장 (만료시간 X)
	 * */
	public <T>  void saveData(
		RedisTemplate<String, T> redisTemplate,
		String key, T value
	) {
		try {
			redisTemplate.opsForValue().set(key, value);
		} catch (RuntimeException e) {
			throw new IllegalArgumentException(e);
		}
	}

	/**
	 * redis 값 조회
	 * */
	public <T> T getData(
		RedisTemplate<String, T> redisTemplate,
		String key
	) {
		try {
			return redisTemplate.opsForValue().get(key);
			// TODO : 없으면 에러
		} catch (RuntimeException e) {
			throw new IllegalArgumentException(e);
		}
	}

	/**
	 * redis 값 수정 (만료시간 0)
	 * */
	public <T> void updateDataUseTTL(
		RedisTemplate<String, T> redisTemplate,
		String key, T value, long expirationTime
	) {
		try {
			if (isExists(redisTemplate, key)) {
				redisTemplate.opsForValue().set(key, value, expirationTime, TimeUnit.SECONDS);
			}

			// TODO : 없으면 에러처리
		} catch (RuntimeException e) {
			throw new IllegalArgumentException(e);
		}
	}

	/**
	 * redis 값 삭제
	 * */
	public <T> void deleteData(RedisTemplate<String, T> redisTemplate, String key) {
		if (key != null && !key.isEmpty()) {
			redisTemplate.delete(key);
		} else {
			throw new IllegalArgumentException();
		}
	}

	/**
	 * redis 값 전체삭제 (Pattern으로 찾아서)
	 * */
	public <T> void deleteReserveUsePatternInRedis(
		RedisTemplate<String, T> redisTemplate,
		String pattern
	) {
		Set<String> keys = redisTemplate.keys(pattern);

		if (!keys.isEmpty()) {
			redisTemplate.delete(keys);
		} else {
			throw new IllegalArgumentException();
		}
	}

	/**
	 * 존재여부 check
	 * */
	public <T> boolean isExists(RedisTemplate<String, T> redisTemplate, String key) {
		return Boolean.TRUE.equals(redisTemplate.hasKey(key));
	}

	/**
	 * 만료시간 계산기
	 * 설정 - 현재시간
	 * */
	public Long getExpirationTime(LocalDateTime settingDateTime, LocalDateTime nowDateTime) {
		return ChronoUnit.SECONDS.between(nowDateTime, settingDateTime);
	}
}
