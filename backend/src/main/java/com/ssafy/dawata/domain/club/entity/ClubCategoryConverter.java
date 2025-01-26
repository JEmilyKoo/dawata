package com.ssafy.dawata.domain.club.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter (autoApply = true)
public class ClubCategoryConverter implements AttributeConverter<GroupCategory, Integer> {
	@Override
	public Integer convertToDatabaseColumn(ClubCategory attribute) {
		if (attribute==null)
			return null;

		return attribute.getCode(); //코드를 db 저장
	}

	@Override
	public GroupCategory convertToEntityAttribute(Integer dbData) {

		if (dbData==null)
			return null;

		return GroupCategory.fromCodeToName(dbData); //숫자 -> name으로
	}
}

