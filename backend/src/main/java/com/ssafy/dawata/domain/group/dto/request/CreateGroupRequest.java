package com.ssafy.dawata.domain.group.dto.request;

import org.antlr.v4.runtime.misc.NotNull;
import org.hibernate.annotations.NotFound;

import com.ssafy.dawata.domain.group.entity.GroupCategory;

public record CreateGroupRequest (
	String name,
	GroupCategory category
)
{
}
