package com.ssafy.dawata.domain.fcm.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class NoticeTypeConverter implements AttributeConverter<NoticeType, Integer> {
	@Override
	public Integer convertToDatabaseColumn(NoticeType attribute) {
		if (attribute == null)
			return null;

		return attribute.getCode(); //코드를 db 저장
	}

	@Override
	public NoticeType convertToEntityAttribute(Integer dbData) {
		if (dbData == null)
			return null;

		return NoticeType.fromCodeToNoticeType(dbData); //숫자 -> string
	}
}

