package com.ssafy.dawata.domain.address.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.dawata.domain.address.entity.MemberAddressMapping;

public interface MemberAddressMappingRepository extends JpaRepository<MemberAddressMapping, Long> {
	boolean existsByMemberId(Long memberId);

	List<MemberAddressMapping> findByMemberId(Long memberId);
}
