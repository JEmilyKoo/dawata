package com.ssafy.dawata.domain.feed.controller;

import com.ssafy.dawata.domain.feed.dto.request.FeedCreateRequest;
import com.ssafy.dawata.domain.feed.dto.request.FeedUpdateRequest;
import com.ssafy.dawata.domain.feed.dto.response.FeedResponse;
import com.ssafy.dawata.domain.feed.service.FeedService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/appointment/{appointmentId}/feed")
@RequiredArgsConstructor
public class FeedController {

    private final FeedService feedService;

    //피드 생성
    @PostMapping
    public ResponseEntity<FeedResponse> createFeed(
        @PathVariable Long appointmentId,
        @RequestBody FeedCreateRequest request) {
        return ResponseEntity.ok(feedService.createFeed(appointmentId, request));
    }

    //모든 피드 조회
    @GetMapping("/clubMember/{clubMemberId}")
    public ResponseEntity<List<FeedResponse>> getFeeds(
        @PathVariable Long appointmentId,
        @PathVariable Long clubMemberId) {
        return ResponseEntity.ok(feedService.getFeedsByAppointment(appointmentId, clubMemberId));
    }

    //특정 피드 조회
    @GetMapping("/{feedId}/clubMember/{clubMemberId}")
    public ResponseEntity<FeedResponse> getFeed(
        @PathVariable Long appointmentId,
        @PathVariable Long clubMemberId,
        @PathVariable Long feedId) {
        return ResponseEntity.ok(feedService.getFeed(appointmentId, feedId, clubMemberId));
    }

    //피드 수정
    @PatchMapping("/{feedId}")
    public ResponseEntity<FeedResponse> updateFeed(
        @PathVariable Long appointmentId,
        @PathVariable Long feedId,
        @RequestBody FeedUpdateRequest request) {
        return ResponseEntity.ok(
            feedService.updateFeed(appointmentId, feedId, request));
    }

    //피드 삭제
    @DeleteMapping("/{feedId}")
    public ResponseEntity<Void> deleteFeed(
        @PathVariable Long appointmentId,
        @PathVariable Long feedId,
        @RequestParam Long requesterId) {
        feedService.deleteFeed(appointmentId, feedId, requesterId);
        return ResponseEntity.noContent().build();
    }


}
