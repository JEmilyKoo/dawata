package com.ssafy.dawata.domain.photo.enums;

import com.ssafy.dawata.domain.participant.enums.DailyStatus;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class EntityCategoryConverter implements AttributeConverter<EntityCategory, Integer> {
	@Override
	public Integer convertToDatabaseColumn(EntityCategory noticeType) {
		return noticeType.getValue();
	}

	@Override
	public EntityCategory convertToEntityAttribute(Integer value) {
		return EntityCategory.fromValue(value);
	}
}
