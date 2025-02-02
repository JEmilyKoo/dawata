package com.ssafy.dawata.domain.routine.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RoutineElement {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String play;

	@Column(nullable = false)
	private Long spendTime;

	@Column(nullable = false)
	private Integer sequence;

	@Column(nullable = false)
	private boolean state = true;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "routine_template_id")
	private RoutineTemplate routineTemplate;

	@Builder(access = AccessLevel.PRIVATE)
	public RoutineElement(String play, Long spendTime, Integer sequence, RoutineTemplate routineTemplate) {
		this.play = play;
		this.spendTime = spendTime;
		this.sequence = sequence;
		this.routineTemplate = routineTemplate;
	}

	public static RoutineElement createRoutineElement(
		String play,
		Long spendTime,
		Integer sequence,
		RoutineTemplate routineTemplate) {
		return RoutineElement.builder()
			.play(play)
			.spendTime(spendTime)
			.sequence(sequence)
			.routineTemplate(routineTemplate)
			.build();
	}
}
