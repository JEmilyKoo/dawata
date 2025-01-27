package com.ssafy.dawata.domain.notice.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class NoticeConverter implements AttributeConverter<NoticeType, Long> {
	@Override
	public Long convertToDatabaseColumn(NoticeType noticeType) {
		return noticeType.getValue();
	}

	@Override
	public NoticeType convertToEntityAttribute(Long aLong) {
		return NoticeType.fromValue(aLong);
	}
}
