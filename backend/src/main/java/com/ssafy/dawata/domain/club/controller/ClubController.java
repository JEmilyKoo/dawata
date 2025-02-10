package com.ssafy.dawata.domain.club.controller;

import com.ssafy.dawata.domain.auth.entity.SecurityMemberDetails;
import com.ssafy.dawata.domain.club.dto.request.*;
import com.ssafy.dawata.domain.club.dto.response.ClubInfoResponse;
import com.ssafy.dawata.domain.club.dto.response.ClubMemberInfoResponse;
import com.ssafy.dawata.domain.club.service.ClubService;
import com.ssafy.dawata.domain.common.dto.ApiResponse;
import com.ssafy.dawata.domain.member.dto.response.ClubJoinSearchResponse;
import com.ssafy.dawata.domain.member.dto.response.MemberInfoResponse;
import com.ssafy.dawata.domain.member.service.MemberService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clubs")
@RequiredArgsConstructor
public class ClubController {
	private final MemberService memberService;
	private final ClubService clubService;

	// 클럽 생성
	@PostMapping
	public ResponseEntity<ApiResponse<ClubInfoResponse>> createClub(
		@RequestBody CreateClubRequest request) {
		return ResponseEntity.ok(clubService.createClub(request));
	}

    // 클럽 생성
    @Operation(summary = "클럽 생성",
            description = "클럽을 생성하는 역할을 합니다.")
    @PostMapping
    public ResponseEntity<ApiResponse<ClubInfoResponse>> createClub(
            @AuthenticationPrincipal SecurityMemberDetails memberDetails,
            @RequestBody CreateClubRequest request) {
        return ResponseEntity.ok(clubService.createClub(request, memberDetails.member()));
    }

    // 특정 클럽 조회
    @Operation(summary = "클럽 하나 데이터 조회",
            description = "clubId에 맞는 클럽 관련 데이터를 조회합니다")
    @GetMapping("/{clubId}")
    public ResponseEntity<ApiResponse<ClubInfoResponse>> getClubById(@AuthenticationPrincipal SecurityMemberDetails memberDetails, @PathVariable Long clubId) {
        return ResponseEntity.ok(clubService.getClubById(clubId, memberDetails.member()));
    }

    // 전체 클럽 조회
    @Operation(summary = "전체 클럽 데이터 조회",
            description = "유저가 가입한 전체 클럽 데이터를 조회합니다")
    @GetMapping
    public ResponseEntity<ApiResponse<List<ClubInfoResponse>>> getAllClubs(@AuthenticationPrincipal SecurityMemberDetails memberDetails) {
        return ResponseEntity.ok(clubService.getAllClubsByMemberId(memberDetails.member()));
    }

    // 클럽 정보 수정
    @Operation(summary = "클럽 정보 수정",
            description = "clubId에 맞는 클럽 관련 데이터를 수정합니다(클럽장만 가능)")
    @PatchMapping("/{clubId}")
    public ResponseEntity<ApiResponse<Boolean>> updateClub(@PathVariable Long clubId,
                                                           @RequestBody UpdateClubRequest request, @AuthenticationPrincipal SecurityMemberDetails memberDetails) {
        return ResponseEntity.ok(clubService.updateClub(request, clubId, memberDetails.member()));
    }

    // 클럽 삭제
    @Operation(summary = "클럽 삭제",
            description = "clubId에 맞는 클럽을 삭제합니다(클럽장만 가능)")
    @DeleteMapping("/{clubId}")
    public ResponseEntity<ApiResponse<Boolean>> deleteClub(@PathVariable Long clubId, @AuthenticationPrincipal SecurityMemberDetails memberDetails) {
        return ResponseEntity.ok(clubService.deleteClub(clubId, memberDetails.member()));
    }

    // 클럽 코드 조회
    @Operation(summary = "클럽 코드 조회",
            description = "clubId에 맞는 클럽 코드를 조회합니다. ")
    @GetMapping("/{clubId}/code")
    public ResponseEntity<ApiResponse<String>> getClubCode(@PathVariable Long clubId, @AuthenticationPrincipal SecurityMemberDetails memberDetails) {
        return ResponseEntity.ok(clubService.getClubCode(clubId, memberDetails.member()));
    }

    // 클럽에 속하는 전체 멤버 데이터 조회
    @Operation(summary = "클럽 멤버 데이터 조회",
            description = "clubId에 맞는 클럽에 속하는 전체 멤버 데이터를 조회합니다 ")
    @GetMapping("/{clubId}/members")
    public ResponseEntity<ApiResponse<List<ClubMemberInfoResponse>>> getClubMembers(
            @PathVariable Long clubId, @AuthenticationPrincipal SecurityMemberDetails memberDetails) {
        return ResponseEntity.ok(clubService.getClubMembers(clubId, memberDetails.member()));
    }

    // 클럽 내 특정 멤버 조회
    @Operation(summary = "클럽 특정 멤버 조회",
            description = "clubId에 맞는 클럽에 속한 특정멤버(clubMemberId)의 데이터를 조회합니다 ")
    @GetMapping("/{clubId}/members/{clubMemberId}")
    public ResponseEntity<ApiResponse<ClubMemberInfoResponse>> getClubMember(
            @PathVariable Long clubId,
            @PathVariable Long clubMemberId, @AuthenticationPrincipal SecurityMemberDetails memberDetails) {
        return ResponseEntity.ok(clubService.getClubMember(clubId, clubMemberId, memberDetails.member()));
    }

    // 이메일로 클럽 멤버 추가
    @Operation(summary = "이메일로 클럽 멤버 추가",
            description = "이미 클럽에 속한 사용자가 클럽에 속하지 않은 다른 멤버를 이메일을 활용하여 클럽으로 추가합니다")
    @PostMapping("/{clubId}/members/email")
    public ResponseEntity<ApiResponse<Boolean>> addClubMemberByEmail(@PathVariable Long clubId,
                                                                     @RequestBody JoinClubByEmailRequest request, @AuthenticationPrincipal SecurityMemberDetails memberDetails) {
        return ResponseEntity.ok(clubService.addClubMemberByEmail(request, clubId, memberDetails.member()));
    }

    // 코드로 클럽 멤버 추가
    @Operation(summary = "코드로 클럽 멤버 추가",
            description = "클럽에 속하고 싶은 당사자가 직접 코드로 특정 클럽에 가입을 합니다. (미리 클럽에 속한 멤버의 경우 에러 발생)")
    @PostMapping("/{clubId}/members/code")
    public ResponseEntity<ApiResponse<Boolean>> addClubMemberByCode(@PathVariable Long clubId,
                                                                    @RequestBody JoinClubByCodeRequest request) {
        return ResponseEntity.ok(clubService.addClubMemberByCode(request, clubId));
    }

    // 클럽 멤버 정보 수정
    @Operation(summary = "클럽 멤버 데이터 수정",
            description = "클럽에 속하는 멤버가 자신의 정보를 수정합니다.")
    @PatchMapping("/{clubId}/members/{clubMemberId}")
    public ResponseEntity<ApiResponse<Boolean>> updateClubMember(@PathVariable Long clubId,
                                                                 @PathVariable Long clubMemberId,
                                                                 @RequestBody UpdateClubMemberRequest request, @AuthenticationPrincipal SecurityMemberDetails memberDetails) {
        return ResponseEntity.ok(clubService.updateClubMember(clubId, clubMemberId, request, memberDetails.member()));
    }

    // 클럽 멤버 탈퇴
    @Operation(summary = "클럽 멤버 탈퇴",
            description = "클럽에 속한 당사자가 직접 클럽을 탈퇴합니다")
    @DeleteMapping("/{clubId}/members/{clubMemberId}")
    public ResponseEntity<ApiResponse<Boolean>> leaveClub(@PathVariable Long clubId,
                                                          @PathVariable Long clubMemberId, @AuthenticationPrincipal SecurityMemberDetails memberDetails) {
        return ResponseEntity.ok(clubService.leaveClub(clubId, clubMemberId, memberDetails.member()));
    }

    // 클럽 멤버 강제 탈퇴 (클럽장만 가능)
    @Operation(summary = "클럽 멤버 강퇴",
            description = "Admin이 특정 멤버를 강퇴시킵니다")
    @DeleteMapping("/{clubId}/members/ban")
    public ResponseEntity<ApiResponse<Boolean>> banClubMember(@PathVariable Long clubId,
                                                              @RequestBody BanClubMemberRequest request, @AuthenticationPrincipal SecurityMemberDetails memberDetails) {
        return ResponseEntity.ok(clubService.banClubMember(clubId, request, memberDetails.member()));
    }

    //클럽장 교체 (클럽장만 가능)
    @Operation(summary = "클럽장 위임",
            description = "기존 클럽장이 다른 클럽 멤버에게 클럽장을 위임합니다.")
    @PatchMapping("/{clubId}/admin")
    public ResponseEntity<ApiResponse<Boolean>> updateClubAdmin(@PathVariable Long clubId,
                                                                @RequestBody UpdateAdminRequest request, @AuthenticationPrincipal SecurityMemberDetails memberDetails) {
        ApiResponse<Boolean> response = clubService.updateAdmin(request, clubId, memberDetails.member());
        return ResponseEntity.ok(response);
    }

    //사진 추가
    @Operation(summary = "클럽 대표 이미지 등록/수정",
            description = "클럽장이 클럽의 대표 이미지를 등록/수정합니다.")
    @PatchMapping("/{clubId}/clubImg")
    public ResponseEntity<ApiResponse<Boolean>> updateClubPhoto(@PathVariable Long clubId,
                                                                @RequestBody
                                                                ClubPhotoRequest request, @AuthenticationPrincipal SecurityMemberDetails memberDetails) {
        ApiResponse<Boolean> response = clubService.updateClubPhoto(clubId, request, memberDetails.member());
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "클럽 대표 이미지 조회",
            description = "클럽 대표 이미지를 조회합니다.")
    @GetMapping("/{clubId}/photo")
    public ApiResponse<String> getClubPhoto(@PathVariable Long clubId) {
        return clubService.getClubPhoto(clubId);
    }

    //사진 삭제
    @Operation(summary = "클럽 대표 이미지 삭제",
            description = "클럽 대표 이미지를 삭제합니다.(클럽장만 가능)")
    @DeleteMapping("/{clubId}/clubImg")
    public ResponseEntity<ApiResponse<Boolean>> deleteClubPhoto(@PathVariable Long clubId, @AuthenticationPrincipal SecurityMemberDetails memberDetails) {
        ApiResponse<Boolean> response = clubService.deleteClubPhoto(clubId, memberDetails.member());
        return ResponseEntity.ok(response);
    }

}
