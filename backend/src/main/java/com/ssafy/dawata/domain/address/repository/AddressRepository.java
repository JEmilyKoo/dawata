package com.ssafy.dawata.domain.address.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.dawata.domain.address.entity.Address;

public interface AddressRepository extends JpaRepository<Address, Long> {
}
