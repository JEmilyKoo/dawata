package com.ssafy.dawata.domain.group.entity;

import com.ssafy.dawata.domain.common.BaseTimeEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "club")
public class Group extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String name;

	@Convert(converter = GroupCategoryConverter.class)
	@Column(nullable = false)
	private GroupCategory category;

	//일단은 업데이트 가능하게.
	@Column(nullable = false, length = 6)
	private String teamCode;

	//img도 일단 만들어둘게요.
	@Column
	private String img;

	@Builder(access = AccessLevel.PRIVATE)
	public Group(String name, GroupCategory category, String teamCode) {
		this.name = name;
		this.category = category;
		this.teamCode = teamCode;
	}

	public static Group createGroup(String name, GroupCategory category, String teamCode) {
		return Group.builder()
			.name(name)
			.category(category)
			.teamCode(teamCode)
			.build();
	}

	public void updateName(String name) {
		this.name = name;
	}

	public void updateCategory(GroupCategory category) {
		this.category = category;
	}

	public void updateImg(String img) {
		this.img = img;
	}

}
