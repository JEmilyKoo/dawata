package com.ssafy.dawata.domain.club.entity;

import com.ssafy.dawata.domain.common.enums.Category;
import com.ssafy.dawata.domain.common.enums.CategoryConverter;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PUBLIC)
@Table(name = "club")
public class Club {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String name;

	@Convert(converter = CategoryConverter.class)
	@Column(nullable = false)
	private Category category;

	//일단은 업데이트 가능하게.
	@Column(nullable = false, length = 6)
	private String teamCode;

	//img도 일단 만들어둘게요.
	@Column
	private String img;

	@OneToMany(mappedBy = "club", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<ClubMember> members;

	@Builder(access = AccessLevel.PRIVATE)
	public Club(String name, Category category, String teamCode) {
		this.name = name;
		this.category = category;
		this.teamCode = teamCode;
	}

	public static Club createClub(String name, Category category, String teamCode) {
		return Club.builder()
			.name(name)
			.category(category)
			.teamCode(teamCode)
			.build();
	}

	public void updateName(String name) {
		this.name = name;
	}

	public void updateCategory(Category category) {
		this.category = category;
	}

	public void updateImg(String img) {
		this.img = img;
	}

}
