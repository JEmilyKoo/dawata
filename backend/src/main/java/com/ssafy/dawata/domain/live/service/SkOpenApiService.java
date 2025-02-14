package com.ssafy.dawata.domain.live.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SkOpenApiService {
	private final ObjectMapper objectMapper;

	@Value("${sk.t_map_walk}")
	private String tMapWalkUrl;

	@Value("${sk.t_map_drive}")
	private String tMapDriveUrl;

	@Value("${sk.api_key}")
	private String apiKey;

	public Map<String, Object> getWalkingRoute(
		double startLat,
		double startLnt,
		double endLat,
		double endLnt
	) throws Exception {
		RestTemplate restTemplate = new RestTemplate();
		HttpHeaders headers = new HttpHeaders();

		// Header 설정
		headers.setContentType(MediaType.APPLICATION_JSON);
		headers.set("appKey", apiKey);

		// 요청 JSON 생성
		Map<String, Object> requestBody = new HashMap<>();
		requestBody.put("startX", startLnt);
		requestBody.put("startY", startLat);
		requestBody.put("endX", endLnt);
		requestBody.put("endY", endLat);
		requestBody.put("startName", "startName");
		requestBody.put("endName", "endName");

		// API 요청
		ResponseEntity<String> response =
			restTemplate.exchange(
				tMapWalkUrl,
				HttpMethod.POST,
				new HttpEntity<>(requestBody, headers),
				String.class
			);

		// 응답 처리
		if (response.getStatusCode() == HttpStatus.OK) {
			return objectMapper.readValue(
				response.getBody(),
				new TypeReference<Map<String, Object>>() {
				}
			);
		}

		throw new IllegalArgumentException("Tmap 오류입니다");
	}
}
