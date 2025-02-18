package com.ssafy.dawata.domain.feed.entity;

import com.ssafy.dawata.domain.club.entity.ClubMember;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "tag_member")
public class TagMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "club_member_id", nullable = false)
    private ClubMember clubMember;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "feed_id", nullable = false)
    private Feed feed;

    @Builder(access = AccessLevel.PRIVATE)
    public TagMember(ClubMember clubMember, Feed feed) {
        this.clubMember = clubMember;
        this.feed = feed;
    }

    public static TagMember create(ClubMember clubMember, Feed feed) {
        return TagMember.builder()
            .clubMember(clubMember)
            .feed(feed)
            .build();
    }

    public void setFeed(Feed feed) {
        this.feed = feed;
    }

}
