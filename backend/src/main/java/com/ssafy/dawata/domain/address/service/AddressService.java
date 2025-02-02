package com.ssafy.dawata.domain.address.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.dawata.domain.address.dto.request.CreateAddressRequest;
import com.ssafy.dawata.domain.address.dto.response.AddressResponseInfo;
import com.ssafy.dawata.domain.address.entity.Address;
import com.ssafy.dawata.domain.address.entity.MemberAddressMapping;
import com.ssafy.dawata.domain.address.repository.AddressRepository;
import com.ssafy.dawata.domain.address.repository.MemberAddressMappingRepository;
import com.ssafy.dawata.domain.common.dto.ApiResponse;
import com.ssafy.dawata.domain.member.entity.Member;
import com.ssafy.dawata.domain.member.service.MemberService;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class AddressService {
	private final AddressRepository addressRepository;
	private final MemberAddressMappingRepository memberAddressMappingRepository;
	private final MemberService memberService;

	//주소 등록
	@Transactional
	public ApiResponse<AddressResponseInfo> createAddress(CreateAddressRequest request) {
		//요청자 가져오기
		Member member = memberService.findMyMemberInfo();
		//주소 저장하고
		Address address = Address.of(request.roadAddress(), request.longitude(), request.latitude());
		addressRepository.save(address);

		//기존 주소가 없었으면 isPrimary true 저장.
		boolean hasAddress = memberAddressMappingRepository.existsByMemberId(member.getId());
		MemberAddressMapping mapping = MemberAddressMapping.createMemberAddressMapping(
			address,
			member,
			request.addressName(),
			!hasAddress
		);
		memberAddressMappingRepository.save(mapping);
		return ApiResponse.success(AddressResponseInfo.from(mapping));
	}

	//멤버 전체 주소 조회
	public ApiResponse<List<AddressResponseInfo>> getAllAddresses() {
		Member member = memberService.findMyMemberInfo();
		List<MemberAddressMapping> mapping = memberAddressMappingRepository.findByMemberId(member.getId());
		List<AddressResponseInfo> response = mapping.stream()
			.map(AddressResponseInfo::from)
			.toList();
		return ApiResponse.success(response);

	}

}
