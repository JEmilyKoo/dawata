package com.ssafy.dawata.domain.member.service;

import com.ssafy.dawata.domain.appointment.repository.AppointmentRepository;
import com.ssafy.dawata.domain.club.dto.request.ClubJoinSearchRequest;
import com.ssafy.dawata.domain.common.service.S3Service;
import com.ssafy.dawata.domain.member.dto.request.MemberInfoUpdateRequest;
import com.ssafy.dawata.domain.member.dto.response.AppointmentInMonthResponse;
import com.ssafy.dawata.domain.member.dto.response.AppointmentInfoResponse;
import com.ssafy.dawata.domain.member.dto.response.ClubJoinSearchResponse;
import com.ssafy.dawata.domain.member.dto.response.MemberInfoResponse;
import com.ssafy.dawata.domain.member.entity.Member;
import com.ssafy.dawata.domain.member.repository.MemberRepository;
import com.ssafy.dawata.domain.participant.repository.ParticipantRepository;
import com.ssafy.dawata.domain.photo.enums.EntityCategory;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {
    private final MemberRepository memberRepository;
    private final AppointmentRepository appointmentRepository;
    private final ParticipantRepository participantRepository;
    private final S3Service s3Service;

    public Member findMyMemberInfo(Member member) {
        // TODO : SecurityContextHolder 구현되면 삭제 예정
        // TODO: Test를 위한 코드 추후에 SecurityContextHolder 에서 정보 가져오기

        return memberRepository
                .findById(member.getId())
                .orElseThrow(IllegalArgumentException::new);
    }

    public MemberInfoResponse findMemberInfo(Member member) {
        // TODO : 내 정보 처리 로직 (SecurityContextHolder 구현 후 위 findMemberInfo 메소드에 적용 예정)
        MemberInfoResponse memberInfoResponse = memberRepository
            .customFindById(member.getId())
            .orElseThrow(IllegalArgumentException::new);

        return MemberInfoResponse.builder()
            .email(memberInfoResponse.email())
            .name(memberInfoResponse.name())
            .img(s3Service.generatePresignedUrl(
                memberInfoResponse.img(),
                "GET",
                EntityCategory.MEMBER,
                member.getId()).toString()
            )
            .createdAt(memberInfoResponse.createdAt())
            .build();
    }

    @Transactional
    public void updateMyInfo(MemberInfoUpdateRequest memberInfoUpdateRequest, Member member) {

        memberRepository
                .findById(member.getId())
                .orElseThrow(IllegalArgumentException::new);

        //더티 체킹 사용
        member.updateName(memberInfoUpdateRequest.name());
    }

    @Transactional
    public void withdraw(Member member) {
        memberRepository
                .findById(member.getId())
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
