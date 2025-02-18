package com.ssafy.dawata.domain.tmap.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.ssafy.dawata.domain.tmap.response.TransitResponse;

import reactor.core.publisher.Mono;

@Service
public class TransitService {

	@Value("${sk.api-key}")
	private String apiKey;

	@Value("${sk.t_map_transit}")
	private String transitAPIURL;

	@Value("${sk.t_map_transit_sub}")
	private String transitSubAPIURL;

	// WebClient 빌더를 통해 Tmap API에 대한 WebClient를 생성
	public WebClient getTransitClient() {
		return WebClient.builder()
			.baseUrl(transitAPIURL)
			.defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
			.defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
			.defaultHeader("appKey", apiKey)
			.build();
	}

	public WebClient getTransitSubClient() {
		return WebClient.builder()
			.baseUrl(transitSubAPIURL)
			.defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
			.defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
			.defaultHeader("appKey", apiKey)
			.build();
	}

	// Tmap API에 대한 요청을 보내는 메소드
	public Mono<TransitResponse> requestTransitAPI(
		Double startX,
		Double startY,
		Double endX,
		Double endY,
		String searchDttm
	) {
		WebClient client = getTransitClient();
		String requestBody = "{\n" +
			"  \"startX\": \"" + startX + "\",\n" +
			"  \"startY\": \"" + startY + "\",\n" +
			"  \"endX\": \"" + endX + "\",\n" +
			"  \"endY\": \"" + endY + "\",\n" +
			"  \"count\": \"" + 1 + "\",\n" +
			"  \"searchDttm\": \"" + searchDttm + "\"\n" +
			"}";

		return client.post()
			.bodyValue(requestBody)
			.retrieve()
			.bodyToMono(TransitResponse.class);
	}

	public Mono<TransitResponse> requestTransitSubAPI(
		Double startX,
		Double startY,
		Double endX,
		Double endY,
		String searchDttm
	) {
		WebClient client = getTransitClient();
		String requestBody = "{\n" +
			"  \"startX\": \"" + startX + "\",\n" +
			"  \"startY\": \"" + startY + "\",\n" +
			"  \"endX\": \"" + endX + "\",\n" +
			"  \"endY\": \"" + endY + "\",\n" +
			"  \"count\": \"" + 1 + "\",\n" +
			"  \"searchDttm\": \"" + searchDttm + "\"\n" +
			"}";

		return client.post()
			.bodyValue(requestBody)
			.retrieve()
			.bodyToMono(TransitResponse.class)
			.onErrorReturn(TransitResponse.errorResponse());
	}

}
