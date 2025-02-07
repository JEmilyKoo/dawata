package com.ssafy.dawata.domain.member.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.dawata.domain.appointment.repository.AppointmentRepository;
import com.ssafy.dawata.domain.member.dto.request.MemberInfoUpdateRequest;
import com.ssafy.dawata.domain.member.dto.response.AppointmentInMonthResponse;
import com.ssafy.dawata.domain.member.dto.response.AppointmentInfoResponse;
import com.ssafy.dawata.domain.member.dto.response.MemberInfoResponse;
import com.ssafy.dawata.domain.member.entity.Member;
import com.ssafy.dawata.domain.member.repository.MemberRepository;
import com.ssafy.dawata.domain.participant.repository.ParticipantRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {
	private final MemberRepository memberRepository;
	private final AppointmentRepository appointmentRepository;
	private final ParticipantRepository participantRepository;

	public Member findMyMemberInfo() {
		// TODO : SecurityContextHolder 구현되면 삭제 예정
		// TODO: Test를 위한 코드 추후에 SecurityContextHolder 에서 정보 가져오기
		Long id = 1L;
		return memberRepository
			.findById(id)
			.orElseThrow(IllegalArgumentException::new);
	}

	public MemberInfoResponse findMemberInfo() {
		// TODO : 내 정보 처리 로직 (SecurityContextHolder 구현 후 위 findMemberInfo 메소드에 적용 예정)
		return memberRepository
			.customFindById(1L)
			.orElseThrow(IllegalArgumentException::new);
	}

	@Transactional
	public void updateMyInfo(MemberInfoUpdateRequest memberInfoUpdateRequest) {
		Long id = 1L;

		Member member = memberRepository
			.findById(id)
			.orElseThrow(IllegalArgumentException::new);

		//더티 체킹 사용
		member.updateName(memberInfoUpdateRequest.name());
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

	public List<AppointmentInfoResponse> findAllMyAppointmentCondition() {
		return participantRepository.countByMemberId(1L);
	}

	public List<AppointmentInMonthResponse> findMyAppointmentInfoInMonth(String date) {
		String[] arr = date.split("-");
		return appointmentRepository.findByScheduledAtInDate(1L, arr[0], arr[1]);
	}
}
