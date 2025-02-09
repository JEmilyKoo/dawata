package com.ssafy.dawata.domain.address.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.dawata.domain.address.entity.MemberAddressMapping;

public interface MemberAddressMappingRepository extends JpaRepository<MemberAddressMapping, Long> {
	boolean existsByMemberId(Long memberId);

	List<MemberAddressMapping> findByMemberId(Long memberId);

	@Query("SELECT mam FROM MemberAddressMapping mam JOIN FETCH mam.address WHERE mam.member.id = :memberId")
	List<MemberAddressMapping> findAllWithAddressByMemberId(@Param("memberId") Long memberId);
}
