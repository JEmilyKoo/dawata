package com.ssafy.dawata.domain.address.dto.response;

import com.ssafy.dawata.domain.address.entity.Address;
import com.ssafy.dawata.domain.address.entity.MemberAddressMapping;

public record AddressResponseInfo(
	long id,
	String roadAddress,
	Double longitude,
	Double latitude,
	String name,
	boolean isPrimary
	//일단은 주소 조회용인 것 같아서 MemeberAddressMapping Id는 반환 안하겠습니다

) {
	public static AddressResponseInfo from(MemberAddressMapping mapping) {
		Address address = mapping.getAddress();
		return new AddressResponseInfo(
			address.getId(),
			address.getRoadAddress(),
			address.getLongitude(),
			address.getLatitude(),
			mapping.getName(),
			mapping.isPrimary()
		);
	}
}
