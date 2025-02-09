package com.ssafy.dawata.domain.feed.dto.request;

import java.util.List;

public record FeedUpdateRequest(
    String content,
    String written,
    List<Long> tagClubMemberIds
) {

}
