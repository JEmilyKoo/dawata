package com.ssafy.dawata.domain.club.entity;

import com.ssafy.dawata.domain.common.entity.BaseTimeEntity;
import com.ssafy.dawata.domain.member.entity.Member;

import jakarta.persistence.Column;
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
import lombok.Setter;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "club_member")
public class ClubMember extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "member_id", nullable = false)
	private Member member;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "club_id", nullable = false)
	private Club club;

	@Column(nullable = false)
	private String nickname;

	@Column(nullable = false)
	private String clubName;

	@Column(nullable = false, columnDefinition = "INT DEFAULT 1")
	private int createdBy;

	@Builder
	public ClubMember(Member member, Club club, String nickname, String clubName, int createdBy) {
		this.member = member;
		this.club = club;

		if (nickname != null) {
			this.nickname = nickname;
		} else {
			this.nickname = member.getName();
		}

		if (clubName != null) {
			this.clubName = clubName;
		} else {
			this.clubName = club.getName();
		}

		this.createdBy = createdBy;
	}

	public static ClubMember createClubMember(Member member, Club club, int createdBy) {
		return ClubMember.builder()
			.member(member)
			.club(club)
			.nickname(member.getName())
			.clubName(club.getName())
			.createdBy(createdBy)
			.build();
	}

	public void updateNickname(String nickname) {
		this.nickname = nickname;
	}

	public void setNickname(String nickname) {
		this.nickname = nickname;
	}

	public void setClubName(String clubName) {
		this.nickname = nickname;
	}

	public void setCreatedBy(int createdBy) {
		this.createdBy = createdBy;
	}
}
