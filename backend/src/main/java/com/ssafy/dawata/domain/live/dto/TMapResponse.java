package com.ssafy.dawata.domain.live.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true) // JSON에서 필요 없는 필드는 무시
public class TMapResponse {

	@JsonProperty("features")
	private List<Feature> features;

	public List<Feature> getFeatures() {
		return features;
	}

	@JsonIgnoreProperties(ignoreUnknown = true)
	public static class Feature {
		@JsonProperty("properties")
		private Properties properties;

		public Properties getProperties() {
			return properties;
		}
	}

	@JsonIgnoreProperties(ignoreUnknown = true)
	public static class Properties {
		@JsonProperty("totalDistance")
		private int totalDistance;

		@JsonProperty("totalTime")
		private int totalTime;

		public int getTotalDistance() {
			return totalDistance;
		}

		public int getTotalTime() {
			return totalTime;
		}
	}
}
