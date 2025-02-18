package com.ssafy.dawata.domain.live.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true) // JSON에서 필요 없는 필드는 무시
public class TMapTransitResponse {

	@JsonProperty("metaData")
	private MetaData metaData;

	@Getter
	@Setter
	@NoArgsConstructor
	@JsonIgnoreProperties(ignoreUnknown = true)
	public static class MetaData {
		@JsonProperty("plan")
		private Plan plan;
	}

	@Getter
	@Setter
	@NoArgsConstructor
	@JsonIgnoreProperties(ignoreUnknown = true)
	public static class Plan {
		@JsonProperty("itineraries")
		private List<Itinerary> itineraries;
	}

	@Getter
	@Setter
	@NoArgsConstructor
	@JsonIgnoreProperties(ignoreUnknown = true)
	public static class Itinerary {
		@JsonProperty("totalTime")
		private int totalTime;

		@JsonProperty("totalDistance")
		private int totalDistance;
	}
}