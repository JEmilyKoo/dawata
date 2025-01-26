package com.ssafy.dawata.domain.club.dto.request;

import com.ssafy.dawata.domain.club.entity.GroupCategory;
public record UpdateGroupRequest (
	String name,
	GroupCategory category,
	String img
){
}
