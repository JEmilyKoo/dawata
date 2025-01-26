package com.ssafy.dawata.domain.group.dto.request;

import com.ssafy.dawata.domain.group.entity.GroupCategory;
public record UpdateGroupRequest (
	String name,
	GroupCategory category,
	String img
){
}
