package com.ssafy.dawata.domain.tmap.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
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
		private Place start;
		private Place end;
		private PassShape passShape;
	}

	@JsonIgnoreProperties(ignoreUnknown = true)
	@Getter
	@Setter
	public static class Place {
		private Double lon;
		private Double lat;
	}

	@JsonIgnoreProperties(ignoreUnknown = true)
	@Getter
	@Setter
	public static class PassShape {
		private String linestring;
	}

	public int getTotalTime() {
		if (metaData == null || metaData.getPlan() == null || metaData.getPlan().getItineraries() == null
			|| metaData.getPlan().getItineraries().isEmpty()) {
			return Integer.MAX_VALUE;
		}
		return Math.round((float)metaData.getPlan().getItineraries().get(0).getTotalTime() / 60);
	}

	public List<String> getPaths() {
		List<String> result = new ArrayList<>();

		if (metaData == null || metaData.getPlan() == null || metaData.getPlan().getItineraries() == null
			|| metaData.getPlan().getItineraries().isEmpty()) {
			return result;
		}

		List<Leg> legs = metaData.getPlan().getItineraries().get(0).getLegs();

		for (Leg leg : legs) {
			if (
				leg.getMode().equals("WALK")
					|| leg.getMode().equals("BUS")
					|| leg.getMode().equals("EXPRESSBUS")
			) {
				result.add(leg.getStart().getLat() + "," + leg.getStart().getLon());
			}

			if (leg.getMode().equals("SUBWAY")) {
				result.addAll(List.of(leg.getPassShape().linestring.split(" ")));
			}
		}
		return result;
	}

	public static TransitResponse errorResponse() {
		TransitResponse result = new TransitResponse();
		result.setMetaData(null);
		return result;
	}
}