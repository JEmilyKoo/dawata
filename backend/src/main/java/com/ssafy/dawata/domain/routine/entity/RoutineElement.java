package com.ssafy.dawata.domain.routine.entity;

import java.time.LocalTime;

import com.ssafy.dawata.domain.member.entity.Member;
import com.ssafy.dawata.domain.notice.enums.NoticeConverter;
import com.ssafy.dawata.domain.routine.enums.PlayType;
import com.ssafy.dawata.domain.routine.enums.PlayTypeConverter;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
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
public class RoutineElement {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column
	@Convert(converter = PlayTypeConverter.class)
	private PlayType play;

	@Column
	private Long spendTime;

	@Column
	private boolean state;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "routine_template_id")
	private RoutineTemplate routineTemplate;
}
