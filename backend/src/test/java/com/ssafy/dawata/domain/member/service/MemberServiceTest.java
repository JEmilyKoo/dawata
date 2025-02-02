package com.ssafy.dawata.domain.member.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import com.ssafy.dawata.domain.member.dto.request.MemberInfoUpdateRequest;
import com.ssafy.dawata.domain.member.dto.response.MemberInfoResponse;
import com.ssafy.dawata.domain.member.entity.Member;
import com.ssafy.dawata.domain.member.repository.MemberRepository;

@ExtendWith(MockitoExtension.class)
class MemberServiceTest {
	@Mock
	private MemberRepository memberRepository;

	@InjectMocks
	private MemberService memberService;

	@Test
	@DisplayName("회원 정보 조회 - 성공")
	void success_findMemberInfo() {
		// given
		Member member =
			new Member("test@test.com", "tester", false);
		MemberInfoResponse response
			= new MemberInfoResponse("test@test.com", "tester", null, LocalDateTime.now());
		// when
		Mockito.when(memberRepository.findById(anyLong()))
			.thenReturn(Optional.of(member));

		// then
		MemberInfoResponse result = memberService.findMemberInfo(1L);

		assertEquals(result.name(), member.getName());
		assertEquals(result.email(), member.getEmail());
	}

	@Test
	@DisplayName("회원 정보 조회 - 실패 (find Error)")
	void fail_findMemberInfo_notFoundMember() {
		// given
		// when
		Mockito.when(memberRepository.findById(1L))
			.thenReturn(Optional.empty());
		// then
		assertThrows(
			IllegalArgumentException.class, () -> {
				memberService.findMemberInfo(1L);
			}
		);
	}

	@Test
	@DisplayName("회원 이름 수정 - 성공")
	void success_updateMemberName() {
		// given
		MemberInfoResponse member = MemberInfoResponse.builder()
			.email("test@test.com")
			.name("tester")
			.img(null)
			.createdAt(LocalDateTime.now())
			.build();
		MemberInfoUpdateRequest request =
			new MemberInfoUpdateRequest("update");

		Member memberSpy =
			Mockito.spy(new Member("test@test.com", "tester", false));
		// when
		Mockito.when(memberRepository.findById(1L))
			.thenReturn(Optional.of(memberSpy));
		// then
		MemberInfoResponse result =
			memberService.updateMyInfo(request);

		assertNotEquals(result.name(), member.name());
		assertEquals(result.email(), member.email());
		assertEquals(result.img(), member.img());
	}

	@Test
	@DisplayName("회원 이름 수정 - 실패 (find Error)")
	void fail_updateMemberName_notFoundMember() {
		// given
		// when
		Mockito.when(memberRepository.findById(1L))
			.thenReturn(Optional.empty());
		// then
		assertThrows(
			IllegalArgumentException.class, () -> {
				memberService.findMemberInfo(1L);
			}
		);
	}

	@Test
	@DisplayName("회원 이름 수정 - 실패 (이름 변경 X)")
	void fail_updateMemberName_notUpdateName() {
		// given
		Member member =
			new Member("test@test.com", "tester", false);
		MemberInfoUpdateRequest request =
			new MemberInfoUpdateRequest("update");
		// when
		Mockito.when(memberRepository.findById(1L))
			.thenReturn(Optional.of(member));
		// then
		MemberInfoResponse result =
			memberService.updateMyInfo(request);

		assertEquals(result.name(), member.getName());
	}

	@Test
	@DisplayName("회원 탈퇴 - 성공")
	void success_withdraw() {
		// given
		// Mockito.spy는 실제 class를 변경시킴
		Member memberSpy =
			Mockito.spy(new Member("test@test.com", "tester", false));
		// when
		Mockito.when(memberRepository.findById(1L))
			.thenReturn(Optional.of(memberSpy));

		memberService.withdraw();
		// then
		assertTrue(memberSpy.isWithdrawn());
	}

	@Test
	@DisplayName("회원 탈퇴 - 실패 (find Error)")
	void fail_withdraw() {
		// given
		// when
		Mockito.when(memberRepository.findById(1L))
			.thenReturn(Optional.empty());
		// then
		assertThrows(
			IllegalArgumentException.class, () -> {
				memberService.findMemberInfo(1L);
			}
		);
	}
}