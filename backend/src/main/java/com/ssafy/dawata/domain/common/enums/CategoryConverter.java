package com.ssafy.dawata.domain.common.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class CategoryConverter implements AttributeConverter<Category, Integer> {
	@Override
	public Integer convertToDatabaseColumn(Category attribute) {
		if (attribute == null)
			return null;

		return attribute.getCode(); //코드를 db 저장
	}

	@Override
	public Category convertToEntityAttribute(Integer dbData) {
		if (dbData == null)
			return null;

		return Category.fromCodeToName(dbData); //숫자 -> name으로
	}
}

