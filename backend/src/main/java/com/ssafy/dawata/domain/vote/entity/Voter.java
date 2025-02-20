package com.ssafy.dawata.domain.vote.entity;

import com.ssafy.dawata.domain.participant.entity.Participant;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Voter {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(
		name = "participant_id",
		referencedColumnName = "id"
	)
	private Participant participant;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(
		name = "vote_item_id",
		referencedColumnName = "id"
	)
	private VoteItem voteItem;
	private Voter(Participant participant, VoteItem voteItem) {
		this.participant = participant;
		this.voteItem = voteItem;
	}

	public static Voter of(Participant participant, VoteItem voteItem) {
		return new Voter(participant, voteItem);
	}
}
