package com.ssafy.dawata.global.util;

import java.time.LocalDateTime;

public class DateUtil {
	public static LocalDateTime get15thDayOfMonth(int currentYear, int currentMonth) {
		return LocalDateTime.now().withYear(currentYear).withMonth(currentMonth).withDayOfMonth(15);
	}
}
