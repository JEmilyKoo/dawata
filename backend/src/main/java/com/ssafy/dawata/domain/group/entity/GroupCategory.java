package com.ssafy.dawata.domain.group.entity;

import lombok.Getter;

@Getter
public enum GroupCategory {
	FRIEND(1, "친목"),
	STUDY(2,"스터디"),
	HOBBY(3, "취미"),
	SOCIAL(4,"동아리"),
	EXERCISE(5, "운동"),
	OTHER(6, "기타");

	private final int code;
	private final String name;

	GroupCategory(int code, String name){
		this.code = code;
		this.name=name;
	}

	//숫자 -> name으로
	public static GroupCategory fromCodeToName(int code){
		for (GroupCategory category : GroupCategory.values()){
			if (code==category.getCode()){
				return category;
			}
		}
		throw new IllegalArgumentException("카테고리 코드 오류");
	}






}
