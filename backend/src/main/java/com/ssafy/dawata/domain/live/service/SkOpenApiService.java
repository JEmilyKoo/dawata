package com.ssafy.dawata.domain.live.service;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.dawata.domain.live.dto.BestTimeAndDistanceResponse;
import com.ssafy.dawata.domain.live.dto.TMapTransitResponse;
import com.ssafy.dawata.domain.live.dto.TMapWalkResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SkOpenApiService {
	private final ObjectMapper objectMapper;

	@Value("${sk.t_map_walk}")
	private String tMapWalkUrl;

	@Value("${sk.t_map_transit}")
	private String tMapTransitUrl;

	@Value("${sk.api_key}")
	private String apiKey;

	//비동기로 받은 데이터들 비교 후 return
	public BestTimeAndDistanceResponse getBestApiResponse(
		double startLat,
		double startLnt,
		double endLat,
		double endLnt
	) {
		CompletableFuture<Map<String, Object>> walkingRoute =
			getWalkingRoute(startLat, startLnt, endLat, endLnt);
		CompletableFuture<Map<String, Object>> transitRoute =
			getTransitRoute(startLat, startLnt, endLat, endLnt);

		return transitRoute
			.thenCombine(walkingRoute, (transitResponse, walkResponse) -> {
				int transitTotalDistance = 0;
				int transitTotalTime = 0;
				int walkTotalDistance = 0;
				int walkTotalTime = 0;

				try {
					TMapTransitResponse.Itinerary tMapTransitResponse =
						objectMapper.convertValue(transitResponse, TMapTransitResponse.class)
							.getMetaData()
							.getPlan()
							.getItineraries()
							.get(0);

					transitTotalDistance = tMapTransitResponse.getTotalDistance();
					transitTotalTime = tMapTransitResponse.getTotalTime();
				} catch (Exception e) {
					transitTotalDistance = 2_000_000;
					transitTotalTime = 2_000_000;
				}

				try {
					TMapWalkResponse.Properties tMapWalkResponse =
						objectMapper.convertValue(walkResponse, TMapWalkResponse.class)
							.getFeatures()
							.get(0)
							.getProperties();

					walkTotalDistance = tMapWalkResponse.getTotalDistance();
					walkTotalTime = tMapWalkResponse.getTotalTime();
				} catch (Exception e) {
					walkTotalDistance = 2_000_000;
					walkTotalTime = 2_000_000;
				}

				if (walkTotalTime + walkTotalDistance + transitTotalDistance + transitTotalTime == 8_000_000) {
					throw new IllegalArgumentException("sk open api에서 두 경로 다 받아오지 못했습니다.");
				}

				return transitTotalTime <= walkTotalTime ?
					BestTimeAndDistanceResponse.builder()
						.totalTime(transitTotalTime / 60)
						.totalDistance(transitTotalDistance)
						.build() :
					BestTimeAndDistanceResponse.builder()
						.totalTime(walkTotalTime / 60)
						.totalDistance(walkTotalDistance)
						.build();
			})
			.exceptionally(error -> {
				return BestTimeAndDistanceResponse.builder()
					.totalTime(-1)
					.totalDistance(-1)
					.build();
			}).join();
	}

	@Async
	public CompletableFuture<Map<String, Object>> getWalkingRoute(
		double startLat, double startLnt, double endLat, double endLnt
	) {
		return getRoute(tMapWalkUrl, startLat, startLnt, endLat, endLnt);
	}

	@Async
	public CompletableFuture<Map<String, Object>> getTransitRoute(
		double startLat, double startLnt, double endLat, double endLnt
	) {
		return getRoute(tMapTransitUrl, startLat, startLnt, endLat, endLnt);
	}

	private CompletableFuture<Map<String, Object>> getRoute(
		String apiUrl, double startLat, double startLnt, double endLat, double endLnt
	) {
		try {
			RestTemplate restTemplate = new RestTemplate();
			HttpHeaders headers = new HttpHeaders();

			headers.setContentType(MediaType.APPLICATION_JSON);
			headers.set("appKey", apiKey);

			Map<String, Object> requestBody = new HashMap<>();
			requestBody.put("startX", startLnt);
			requestBody.put("startY", startLat);
			requestBody.put("endX", endLnt);
			requestBody.put("endY", endLat);

			if (apiUrl.equals(tMapWalkUrl)) {
				requestBody.put("startName", "출발지");
				requestBody.put("endName", "목적지");

			}

			ResponseEntity<String> response =
				restTemplate.exchange(
					apiUrl,
					HttpMethod.POST,
					new HttpEntity<>(requestBody, headers),
					String.class
				);

			if (response.getStatusCode() == HttpStatus.OK) {
				Map<String, Object> responseMap = objectMapper.readValue(
					response.getBody(), new TypeReference<Map<String, Object>>() {
					}
				);
				return CompletableFuture.completedFuture(responseMap);
			}

			throw new IllegalArgumentException("Tmap 오류 발생");
		} catch (Exception e) {
			return CompletableFuture.failedFuture(e);
		}
	}
}
