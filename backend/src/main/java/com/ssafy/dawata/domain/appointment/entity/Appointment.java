package com.ssafy.dawata.domain.appointment.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.DynamicUpdate;

import com.ssafy.dawata.domain.common.entity.BaseEntity;
import com.ssafy.dawata.domain.common.enums.Category;
import com.ssafy.dawata.domain.common.enums.CategoryConverter;
import com.ssafy.dawata.domain.participant.entity.Participant;
import com.ssafy.dawata.domain.vote.entity.VoteItem;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@DynamicUpdate
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Appointment extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column
	private String name;

	@Convert(converter = CategoryConverter.class)
	@Column
	private Category category;

	@Column
	private LocalDateTime scheduledAt;

	@Column
	private LocalDateTime voteEndTime;

	@OneToMany(mappedBy = "appointment", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Participant> participants = new ArrayList<>();

	@OneToMany(mappedBy = "appointment", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<VoteItem> voteItems = new ArrayList<>();

	@Builder(access = AccessLevel.PRIVATE)
	private Appointment(String name, Category category, LocalDateTime scheduledAt, LocalDateTime voteEndTime) {
		this.name = name;
		this.category = category;
		this.scheduledAt = scheduledAt;
		this.voteEndTime = voteEndTime;
	}

	public static Appointment createAppointment(String name, Category category, LocalDateTime scheduledAt,
		LocalDateTime voteEndTime) {
		return new Appointment(name, category, scheduledAt, voteEndTime);
	}

	public void updateName(String name) {
		this.name = name;
	}

	public void updateCategory(Category category) {
		this.category = category;
	}

	public void updateScheduledAt(LocalDateTime scheduledAt) {
		this.scheduledAt = scheduledAt;
	}

	public void updateVoteEndTime(LocalDateTime voteEndTime) {
		this.voteEndTime = voteEndTime;
	}
}
