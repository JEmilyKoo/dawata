package com.ssafy.dawata.domain.tmap.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TransitResponse {

	private MetaData metaData;

	@JsonIgnoreProperties(ignoreUnknown = true)
	@Getter
	@Setter
	public static class MetaData {
		private RequestParameters requestParameters;
		private Plan plan;

	}

	@JsonIgnoreProperties(ignoreUnknown = true)
	@Getter
	@Setter
	public static class RequestParameters {
		private String endY;    // 도착지 위도
		private String endX;    // 도착지 경도
		private String startY;    // 출발지 위도
		private String startX;    // 출발지 경도
		private String reqDttm;    // 요청 시간

	}

	@JsonIgnoreProperties(ignoreUnknown = true)
	@Getter
	@Setter
	public static class Plan {
		private List<Itinerary> itineraries;

	}

	@JsonIgnoreProperties(ignoreUnknown = true)
	@Getter
	@Setter
	public static class Itinerary {
		private int totalTime;    // 총 소요 시간 (초 단위)
		private int walkTime;
		private int transferCount;
		private int totalDistance;
		private int pathType;
		private List<Leg> legs;
	}

	@JsonIgnoreProperties(ignoreUnknown = true)
	@Getter
	@Setter
	public static class Leg {
		private String mode;
		private int sectionTime;
		private int distance;
		private Place start;
		private Place end;
		private List<Step> steps;
	}

	@JsonIgnoreProperties(ignoreUnknown = true)
	@Getter
	@Setter
	public static class Place {
		private String name;
		private Double lon;
		private Double lat;
	}

	@JsonIgnoreProperties(ignoreUnknown = true)
	@Getter
	@Setter
	public static class Step {
		private String streetName;
		private int distance;
		private String description;
		private String linestring;
	}

	public int getTotalTime() {
		return metaData.getPlan().getItineraries().get(0).getTotalTime();
	}

	public static TransitResponse errorResponse() {
		TransitResponse result = new TransitResponse();
		result.setMetaData(null);
		return result;
	}
}