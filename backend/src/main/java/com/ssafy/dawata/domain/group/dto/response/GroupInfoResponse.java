package com.ssafy.dawata.domain.group.dto.response;

import com.ssafy.dawata.domain.group.entity.Group;
import com.ssafy.dawata.domain.group.entity.GroupCategory;

public record GroupInfoResponse(
	Long id,
	String name,
	GroupCategory category,
	String teamCode
)

{
	public static GroupInfoResponse from(Group group){
		return new GroupInfoResponse(
			group.getId(),
			group.getName(),
			group.getCategory(),
			group.getTeamCode());
	}
}
