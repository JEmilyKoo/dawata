package com.ssafy.dawata.domain.group.entity;

import jakarta.persistence.AttributeConverter;

public class GroupCategoryConverter implements AttributeConverter<GroupCategory, Integer> {
	@Override
	public Integer convertToDatabaseColumn(GroupCategory attribute) {
		if (attribute==null)
			return null;

		return attribute.getCode();
	}

	@Override
	public GroupCategory convertToEntityAttribute(Integer dbData) {

		if (dbData==null)
			return null;

		return GroupCategory.fromCode(dbData);
	}
}

