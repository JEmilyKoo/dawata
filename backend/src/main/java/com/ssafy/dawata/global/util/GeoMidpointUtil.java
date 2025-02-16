package com.ssafy.dawata.global.util;

import java.util.List;

public class GeoMidpointUtil {

	private static final double EARTH_RADIUS_M = 6371000.0;

	public static double[] getSimpleMidPoint(List<double[]> coordinates) {
		if (coordinates == null || coordinates.isEmpty()) {
			throw new IllegalArgumentException("좌표 리스트가 비어 있습니다.");
		}

		double sumLat = 0.0;
		double sumLng = 0.0;
		int count = coordinates.size();

		// 위도와 경도의 평균 계산
		for (double[] coordinate : coordinates) {
			sumLat += coordinate[0];
			sumLng += coordinate[1];
		}

		return new double[] {sumLat / count, sumLng / count}; // 중앙값 반환
	}

	public static double[] getMidpoint() {
		// TODO: 구현 필요

		return new double[] {37.498095, 127.027610};
	}

	public static double[] getLatLngBounds(List<double[]> coordinates) {
		if (coordinates == null || coordinates.isEmpty()) {
			throw new IllegalArgumentException("좌표 리스트가 비어 있습니다.");
		}

		// 초기값 설정 (첫 번째 좌표로 초기화)
		double maxLat = coordinates.get(0)[0];
		double minLat = coordinates.get(0)[0];
		double maxLng = coordinates.get(0)[1];
		double minLng = coordinates.get(0)[1];

		// 최대, 최소값 찾기
		for (double[] coordinate : coordinates) {
			double lat = coordinate[0];
			double lng = coordinate[1];

			maxLat = Math.max(maxLat, lat);
			maxLng = Math.max(maxLng, lng);
			minLat = Math.min(minLat, lat);
			minLng = Math.min(minLng, lng);
		}

		return new double[] {minLat, maxLat, minLng, maxLng};
	}

	public static double calculateAverageDistance(List<double[]> coordinates) {
		if (coordinates == null || coordinates.size() < 2) {
			throw new IllegalArgumentException("두 개 이상의 좌표가 필요합니다.");
		}

		int count = 0;
		double totalDistance = 0.0;

		// 모든 점들의 쌍을 비교하여 거리 계산
		for (int i = 0; i < coordinates.size(); i++) {
			for (int j = i + 1; j < coordinates.size(); j++) {
				totalDistance += haversineDistance(coordinates.get(i), coordinates.get(j));
				count++;
			}
		}

		return totalDistance / count; // 평균 거리 반환
	}

	// 두 좌표 사이의 Haversine 거리 계산 (단위: m)
	public static double haversineDistance(double[] point1, double[] point2) {
		double lat1 = Math.toRadians(point1[0]);
		double lon1 = Math.toRadians(point1[1]);
		double lat2 = Math.toRadians(point2[0]);
		double lon2 = Math.toRadians(point2[1]);

		double dLat = lat2 - lat1;
		double dLon = lon2 - lon1;

		double a = Math.pow(Math.sin(dLat / 2), 2) +
			Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dLon / 2), 2);
		double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		return EARTH_RADIUS_M * c; // 거리 반환 (m 단위)
	}
}
