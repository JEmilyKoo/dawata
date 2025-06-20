package com.ssafy.dawata.domain.address.entity;

import java.util.Optional;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Address {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column
	private String roadAddress;

	@Column
	private Double longitude;

	@Column
	private Double latitude;

	@Builder(access = AccessLevel.PRIVATE)
	private Address(String roadAddress, Double longitude, Double latitude) {
		this.roadAddress = roadAddress;
		this.longitude = longitude;
		this.latitude = latitude;
	}

	public static Address of(String roadAddress, Double longitude, Double latitude) {
		return new Address(roadAddress, longitude, latitude);
	}

	public static Address of(Address existingAddress, Optional<String> roadAddress, Optional<Double> longitude,
		Optional<Double> latitude) {
		return new Address(
			roadAddress.orElse(existingAddress.getRoadAddress()),
			longitude.orElse(existingAddress.getLongitude()),
			latitude.orElse(existingAddress.getLatitude())
		);
	}

	public void updateRoadAddress(String roadAddress) {
		this.roadAddress = roadAddress;
	}

	public void updateLongitude(Double longitude) {
		this.longitude = longitude;
	}

	public void updateLatitude(Double latitude) {
		this.latitude = latitude;
	}

}

