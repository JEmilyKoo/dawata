package com.ssafy.dawata.domain.feed.repository;

import com.ssafy.dawata.domain.feed.entity.TagMember;
import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public interface TagMemberRepository {

    List<TagMember> findByFeedId(Long feedId);

}
