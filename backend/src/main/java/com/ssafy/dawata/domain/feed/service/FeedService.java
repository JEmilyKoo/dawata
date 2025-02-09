package com.ssafy.dawata.domain.feed.service;

import com.ssafy.dawata.domain.appointment.entity.Appointment;
import com.ssafy.dawata.domain.appointment.repository.AppointmentRepository;
import com.ssafy.dawata.domain.club.entity.ClubMember;
import com.ssafy.dawata.domain.club.repository.ClubMemberRepository;
import com.ssafy.dawata.domain.feed.dto.request.FeedCreateRequest;
import com.ssafy.dawata.domain.feed.dto.request.FeedUpdateRequest;
import com.ssafy.dawata.domain.feed.dto.response.FeedResponse;
import com.ssafy.dawata.domain.feed.entity.Feed;
import com.ssafy.dawata.domain.feed.entity.TagMember;
import com.ssafy.dawata.domain.feed.repository.FeedRepository;
import com.ssafy.dawata.domain.member.entity.Member;
import com.ssafy.dawata.domain.member.service.MemberService;
import com.ssafy.dawata.domain.participant.repository.ParticipantRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FeedService {

    private final FeedRepository feedRepository;
    private final AppointmentRepository appointmentRepository;
    private final ClubMemberRepository clubMemberRepository;
    private final ParticipantRepository participantRepository;
    private final MemberService memberService;


    @Transactional
    public FeedResponse createFeed(Long appointmentId, FeedCreateRequest request) {
        Member member = memberService.findMyMemberInfo();
        //피드 생성
        ClubMember clubMember = clubMemberRepository.findById(member.getId())
            .orElseThrow(() -> new EntityNotFoundException("클럽 멤버 X."));

        boolean isParticipant = participantRepository.findByClubMemberIdAndAppointmentId(
            clubMember.getId(), appointmentId).isPresent();
        if (!isParticipant) {
            throw new IllegalStateException("약속 참여자 X");
        }
        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new IllegalArgumentException("appointment 존재X"));

        Feed feed = Feed.create(request.content(), member.getEmail(), appointment);

        List<TagMember> tagMembers = request.tagClubMemberIds().stream()
            .map(clubMemberId -> {
                ClubMember tagMember = clubMemberRepository.findById(clubMemberId)
                    .orElseThrow(() -> new IllegalStateException("클럽멤버X"));
                return TagMember.create(tagMember, feed);
            })
            .collect(Collectors.toList());

        tagMembers.forEach(feed::addTagMember);
        feedRepository.save(feed);

        return FeedResponse.from(feed);
    }

    //약속 전체 피드 조회
    public List<FeedResponse> getFeedsByAppointment(Long appointmentId, Long clubMemberId) {
        //validateClubMember(clubMemberId); 이 과정을 굳이 넣는 게 맞을까 ..

        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new IllegalStateException("약속 존재 X"));

        List<Feed> feeds = feedRepository.findByAppointment(appointment);
        return feeds.stream().map(FeedResponse::from).toList();
    }

    //특정 피드 조회
    public FeedResponse getFeed(Long appointmentId, Long feedId, Long clubMemberId) {
        //validateClubMember(clubMemberId);

        Feed feed = feedRepository.findByIdAndAppointmentId(feedId, appointmentId)
            .orElseThrow(() -> new IllegalStateException("피드 X"));

        return FeedResponse.from(feed);
    }


    //피드 수정
    @Transactional
    public FeedResponse updateFeed(Long appointmentId, Long feedId, FeedUpdateRequest request) {
        Feed feed = feedRepository.findByIdAndAppointmentId(feedId, appointmentId)
            .orElseThrow(() -> new IllegalStateException("피드 X"));

        if (request.content() != null) {
            feed.updateContent(request.content());
        }

        if (request.tagClubMemberIds() != null) {
            // 기존 태그 멤버 제거
            feed.getTagMembers().clear();

            // 새로운 태그 멤버 추가
            List<TagMember> tagMembers = request.tagClubMemberIds().stream()
                .map(clubMemberId -> {
                    ClubMember tagMember = clubMemberRepository.findById(clubMemberId)
                        .orElseThrow(() -> new IllegalStateException("태그할 클럽 멤버 X."));
                    return TagMember.create(tagMember, feed);
                })
                .collect(Collectors.toList());

            tagMembers.forEach(feed::addTagMember);
        }

        return FeedResponse.from(feed);
    }

    //피드 삭제
    @Transactional
    public void deleteFeed(Long appointmentId, Long feedId, Long requesterId) {
        Feed feed = feedRepository.findByIdAndAppointmentId(feedId, appointmentId)
            .orElseThrow(() -> new IllegalStateException("피드 X"));

        feedRepository.delete(feed);
    }

    /// ////메서드 분리/////
    private void validateClubMember(Long clubMemberId) {
        if (!clubMemberRepository.existsById(clubMemberId)) {
            throw new EntityNotFoundException("클럽 멤버 X");
        }
    }


}
