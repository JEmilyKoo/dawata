package com.ssafy.dawata.domain.address.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.dawata.domain.address.dto.request.CreateAddressRequest;
import com.ssafy.dawata.domain.address.dto.request.UpdateAddressRequest;
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
	public ApiResponse<AddressResponseInfo> createAddress(CreateAddressRequest request, Member member) {
		//주소 저장하고
		Address address = Address.of(request.roadAddress(), request.longitude(), request.latitude());
		addressRepository.save(address);

		boolean hasAddress = memberAddressMappingRepository.existsByMemberId(member.getId());

		if (request.isPrimary() && hasAddress) {
			List<MemberAddressMapping> existingAddresses = memberAddressMappingRepository.findByMemberId(
				member.getId());

			for (MemberAddressMapping mapping : existingAddresses) {
				if (mapping.isPrimary()) {
					mapping.updateIsPrimary(false);
				}
			}
		}

		MemberAddressMapping mapping = MemberAddressMapping.createMemberAddressMapping(
			address,
			member,
			request.addressName(),
			request.isPrimary() || !hasAddress
		);
		memberAddressMappingRepository.save(mapping);
		return ApiResponse.success(AddressResponseInfo.from(mapping));
	}

	//멤버 전체 주소 조회
	public ApiResponse<List<AddressResponseInfo>> getAllAddresses(Member member) {
		List<MemberAddressMapping> mapping = memberAddressMappingRepository.findAllWithAddressByMemberId(
			member.getId());
		List<AddressResponseInfo> response = mapping.stream()
			.map(AddressResponseInfo::from)
			.toList();
		return ApiResponse.success(response);

	}

	@Transactional
	//주소 수정 (부분 수정 가능) . null값 체크는 validator로 분리 예정
	public ApiResponse<AddressResponseInfo> updateAddress(Long addressId, UpdateAddressRequest request, Member member) {
		//수정 요청 들어온 addressId에 맞는 정보 있는지 체크
		MemberAddressMapping mapping = memberAddressMappingRepository.findByAddressId(addressId)
			.orElseThrow(() -> new IllegalArgumentException("요청 주소 없음"));

		//그 주소가 요청보낸 클라이언트의 주소가 맞는지 체크
		// if (!mapping.getMember().getId().equals(member.getId())) {
		// 	throw new IllegalArgumentException("클라이언트의 주소 정보 아님");
		// }

		Address address = mapping.getAddress();
		request.roadAddress().ifPresent(address::updateRoadAddress);
		request.longitude().ifPresent(address::updateLongitude);
		request.latitude().ifPresent(address::updateLatitude);
		request.addressName().ifPresent(name -> {
			mapping.updateName(name);
		});
		List<MemberAddressMapping> mappings = memberAddressMappingRepository.findByMemberId(member.getId());
		//대표주소로 설정하겠다는 요청일 경우 나머지 주소들 비대표주소로 변경
		request.isPrimary().ifPresent(isPrimary -> {
			if (isPrimary) {
				for (MemberAddressMapping last : mappings) {
					if (!last.getId().equals(mapping.getId())) {
						last.updateIsPrimary(false);
					}
				}
				mapping.updateIsPrimary(true);
			} else {
				boolean checkPrimary = mappings.stream()
					.anyMatch(m -> !m.getId().equals(mapping.getId()) && m.isPrimary());

				if (!checkPrimary || mappings.size() == 1) {
					throw new IllegalStateException("다른 대표주소값이 없음");
				}
			}
		});

		return ApiResponse.success(AddressResponseInfo.from(mapping));
	}

	//주소 하나 조회
	public ApiResponse<AddressResponseInfo> getAddress(Long addressId, Member member) {
		MemberAddressMapping mapping = validateAddressIdAndMemberId(addressId, member);
		return ApiResponse.success(AddressResponseInfo.from(mapping));
	}

	////////vaidate 메서드 분리///////
	private MemberAddressMapping validateAddressIdAndMemberId(Long addressId, Member member) {
		MemberAddressMapping mapping = memberAddressMappingRepository.findByAddressId(addressId)
			.orElseThrow(() -> new IllegalArgumentException("요청 주소 없음"));

		if (!mapping.getMember().getId().equals(member.getId())) {
			throw new IllegalArgumentException("클라이언트의 주소 정보 아님");
		}
		return mapping;
	}

	//주소 삭제
	@Transactional
	public void deleteAddress(Long addressId, Member member) {
		MemberAddressMapping mapping = validateAddressIdAndMemberId(addressId, member);
		memberAddressMappingRepository.delete(mapping);
	}
}
