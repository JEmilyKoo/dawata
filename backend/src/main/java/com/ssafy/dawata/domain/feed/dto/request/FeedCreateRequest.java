package com.ssafy.dawata.domain.feed.dto.request;

import java.util.List;

public record FeedCreateRequest(
    String content,
    List<Long> tagClubMemberIds
) {

}
