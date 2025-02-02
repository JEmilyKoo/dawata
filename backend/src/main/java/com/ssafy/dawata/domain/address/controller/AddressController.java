package com.ssafy.dawata.domain.address.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.dawata.domain.address.dto.request.CreateAddressRequest;
import com.ssafy.dawata.domain.address.dto.response.AddressResponseInfo;
import com.ssafy.dawata.domain.address.service.AddressService;
import com.ssafy.dawata.domain.common.dto.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/addresses")
public class AddressController {
	private final AddressService addressService;

	//주소 등록
	@PostMapping
	public ResponseEntity<ApiResponse<AddressResponseInfo>> createAddress(@RequestBody CreateAddressRequest request) {
		AddressResponseInfo response = addressService.createAddress(request).data();
		return ResponseEntity.ok(ApiResponse.success(response));
	}

	//클라이언트 전체주소 반환
	@GetMapping
	public ResponseEntity<ApiResponse<List<AddressResponseInfo>>> getAllAddresses() {
		List<AddressResponseInfo> response = addressService.getAllAddresses().data();
		return ResponseEntity.ok(ApiResponse.success(response));
	}

}
