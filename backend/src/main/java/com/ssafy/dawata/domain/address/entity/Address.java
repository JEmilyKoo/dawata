package com.ssafy.dawata.domain.address.entity;

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
}

