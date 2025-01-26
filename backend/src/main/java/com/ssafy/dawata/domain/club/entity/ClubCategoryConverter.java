package com.ssafy.dawata.domain.club.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter (autoApply = true)
public class ClubCategoryConverter implements AttributeConverter<ClubCategory, Integer> {
	@Override
	public Integer convertToDatabaseColumn(ClubCategory attribute) {
		if (attribute==null)
			return null;

		return attribute.getCode(); //코드를 db 저장
	}

	@Override
	public ClubCategory convertToEntityAttribute(Integer dbData) {

		if (dbData==null)
			return null;

		return ClubCategory.fromCodeToName(dbData); //숫자 -> name으로
	}
}

