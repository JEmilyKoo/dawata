package com.ssafy.dawata.domain.member.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.dawata.domain.appointment.repository.AppointmentRepository;
import com.ssafy.dawata.domain.common.service.S3Service;
import com.ssafy.dawata.domain.member.dto.request.MemberInfoUpdateRequest;
import com.ssafy.dawata.domain.member.dto.response.AppointmentInMonthResponse;
import com.ssafy.dawata.domain.member.dto.response.AppointmentInfoResponse;
import com.ssafy.dawata.domain.member.dto.response.MemberInfoResponse;
import com.ssafy.dawata.domain.member.entity.Member;
import com.ssafy.dawata.domain.member.repository.MemberRepository;
import com.ssafy.dawata.domain.participant.repository.ParticipantRepository;
import com.ssafy.dawata.domain.photo.entity.Photo;
import com.ssafy.dawata.domain.photo.enums.EntityCategory;
import com.ssafy.dawata.domain.photo.repository.PhotoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {
	private final MemberRepository memberRepository;
	private final AppointmentRepository appointmentRepository;
	private final ParticipantRepository participantRepository;
	private final S3Service s3Service;
	private final PhotoRepository photoRepository;

	public Member findMyMemberInfo(Member member) {
		// TODO : SecurityContextHolder 구현되면 삭제 예정
		// TODO: Test를 위한 코드 추후에 SecurityContextHolder 에서 정보 가져오기

		return memberRepository
			.findById(member.getId())
			.orElseThrow(IllegalArgumentException::new);
	}

	public MemberInfoResponse findMemberInfo(Long memberId) {
		Member member = memberRepository.findById(memberId).orElseThrow(
			() -> new IllegalArgumentException("해당 회원이 존재하지 않습니다.")
		);

		Photo photo = photoRepository
			.findByEntityIdAndEntityCategory(member.getId(), EntityCategory.MEMBER)
			.orElse(
				Photo.createDefaultPhoto(member.getId(), EntityCategory.MEMBER)
			);

		return MemberInfoResponse.builder()
			.email(member.getEmail())
			.name(member.getName())
			.img(
				s3Service.generatePresignedUrl(
					photo.getPhotoName(),
					"GET",
					EntityCategory.MEMBER,
					member.getId()
				)
			)
			.createdAt(member.getCreatedAt())
			.build();
	}

	@Transactional
	public void updateMyInfo(MemberInfoUpdateRequest memberInfoUpdateRequest, Long memberId) {

		Member member = memberRepository
			.findById(memberId)
			.orElseThrow(IllegalArgumentException::new);

		//더티 체킹 사용
		member.updateName(memberInfoUpdateRequest.name());
	}

	@Transactional
	public void withdraw(Long memberId) {
		Member member = memberRepository
			.findById(memberId)
			.orElseThrow(IllegalArgumentException::new);

		//더티 체킹 사용
		member.updateIsWithdrawn(true);
	}

	public List<AppointmentInfoResponse> findAllMyAppointmentCondition(Member member) {
		return participantRepository.countByMemberId(member.getId());
	}

	public List<AppointmentInMonthResponse> findMyAppointmentInfoInMonth(String date, Member member) {
		String[] arr = date.split("-");
		return appointmentRepository.findByScheduledAtInDate(member.getId(), arr[0], arr[1]);
	}
}
