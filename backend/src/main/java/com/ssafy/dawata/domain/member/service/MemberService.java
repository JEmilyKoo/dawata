package com.ssafy.dawata.domain.member.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.dawata.domain.member.dto.request.MemberInfoUpdateRequest;
import com.ssafy.dawata.domain.member.dto.response.AppointmentInfoResponse;
import com.ssafy.dawata.domain.member.dto.response.MemberInfoResponse;
import com.ssafy.dawata.domain.member.entity.Member;
import com.ssafy.dawata.domain.member.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

	private final MemberRepository memberRepository;

	public Member findMyMemberInfo() {
		// TODO: Test를 위한 코드 추후에 SecurityContextHolder 에서 정보 가져오기
		Long id = 1L;
		return memberRepository
			.findById(id)
			.orElseThrow(IllegalArgumentException::new);
	}

	public MemberInfoResponse findMemberInfo(Long memberId) {
		// TODO : 내 정보 처리 로직 (SecurityContextHolder 구현 후 위 findMemberInfo 메소드에 적용 예정)
		return toMemberInfo(
			memberRepository
				.findById(memberId)
				.orElseThrow(IllegalArgumentException::new));
	}

	@Transactional
	public MemberInfoResponse updateMyInfo(MemberInfoUpdateRequest memberInfoUpdateRequest) {
		Long id = 1L;

		Member member = memberRepository
			.findById(id)
			.orElseThrow(IllegalArgumentException::new);

		//더티 체킹 사용
		member.updateName(memberInfoUpdateRequest.name());

		return toMemberInfo(member);
	}

	@Transactional
	public void updateMyImg(String url) {
		// TODO : 이미지 관련 사항 확정 시 작업 예정
	}

	@Transactional
	public void withdraw() {
		Long id = 1L;

		Member member = memberRepository
			.findById(id)
			.orElseThrow(IllegalArgumentException::new);

		//더티 체킹 사용
		member.updateIsWithdrawn(true);
	}

	public AppointmentInfoResponse findAllMyAppointmentInfo() {
		// TODO : 약속 관련 기능 구현 시 작업 예정
		return null;
	}

	private MemberInfoResponse toMemberInfo(Member member) {
		// TODO : 이미지관련 사항 확정 시 작업 예정

		return MemberInfoResponse.builder()
			.email(member.getEmail())
			.name(member.getName())
			.img(null)
			.createdAt(member.getCreatedAt())
			.build();
	}
}
