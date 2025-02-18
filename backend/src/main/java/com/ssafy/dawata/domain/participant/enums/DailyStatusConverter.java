package com.ssafy.dawata.domain.participant.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class DailyStatusConverter implements AttributeConverter<DailyStatus, String> {
	@Override
	public String convertToDatabaseColumn(DailyStatus dailyStatus) {
		return dailyStatus.getCode();
	}

	@Override
	public DailyStatus convertToEntityAttribute(String code) {
		return DailyStatus.of(code);
	}
}
