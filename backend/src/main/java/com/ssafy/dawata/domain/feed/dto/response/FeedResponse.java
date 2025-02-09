package com.ssafy.dawata.domain.feed.dto.response;

import com.ssafy.dawata.domain.feed.entity.Feed;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public record FeedResponse(
    Long feedId,
    String content,
    String written,
    LocalDateTime createdAt,
    List<TagMemberResponse> tagMembers
) {

    public static FeedResponse from(Feed feed) {
        return new FeedResponse(
            feed.getId(),
            feed.getContent(),
            feed.getWritten(),
            feed.getCreatedAt(),
            feed.getTagMembers().stream()
                .map(TagMemberResponse::from)
                .collect(Collectors.toList())

        );
    }
}
