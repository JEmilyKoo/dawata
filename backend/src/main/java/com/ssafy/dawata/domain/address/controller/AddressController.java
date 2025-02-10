package com.ssafy.dawata.domain.address.controller;

import com.ssafy.dawata.domain.address.dto.request.UpdateAddressRequest;
import com.ssafy.dawata.domain.address.dto.response.AddressResponseInfo;
import com.ssafy.dawata.domain.address.service.AddressService;
import com.ssafy.dawata.domain.auth.entity.SecurityMemberDetails;
import com.ssafy.dawata.domain.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/addresses")
public class AddressController {
    private final AddressService addressService;

    //주소 등록
    @PostMapping
    public ResponseEntity<ApiResponse<AddressResponseInfo>> createAddress(@RequestBody UpdateAddressRequest request, @AuthenticationPrincipal SecurityMemberDetails memberDetails) {
        AddressResponseInfo response = addressService.createAddress(request, memberDetails.member()).data();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    //클라이언트 전체주소 조회
    @GetMapping
    public ResponseEntity<ApiResponse<List<AddressResponseInfo>>> getAllAddresses(@AuthenticationPrincipal SecurityMemberDetails memberDetails) {
        List<AddressResponseInfo> response = addressService.getAllAddresses(memberDetails.member()).data();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    //주소 수정(부분 수정 가능)
    @PatchMapping("/{addressId}")
    public ResponseEntity<ApiResponse<AddressResponseInfo>> updateAddress(@PathVariable Long addressId,
                                                                          @RequestBody UpdateAddressRequest request, @AuthenticationPrincipal SecurityMemberDetails memberDetails) {
        System.out.println("=====수정======");
        AddressResponseInfo response = addressService.updateAddress(addressId, request, memberDetails.member()).data();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    //특정 주소 조회
    @GetMapping("/{addressId}")
    public ResponseEntity<ApiResponse<AddressResponseInfo>> getAddress(@PathVariable Long addressId, @AuthenticationPrincipal SecurityMemberDetails memberDetails) {
        System.out.println("====특정 주소 조회=====");
        AddressResponseInfo response = addressService.getAddress(addressId, memberDetails.member()).data();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    //특정 주소 삭제
    @DeleteMapping("/{addressId}")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(@PathVariable Long addressId, @AuthenticationPrincipal SecurityMemberDetails memberDetails) {
        addressService.deleteAddress(addressId, memberDetails.member());
        return ResponseEntity.ok(ApiResponse.success());
    }
}
