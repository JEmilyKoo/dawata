package com.ssafy.dawata.domain.common.error;

import org.springframework.http.HttpStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class ErrorCode implements ErrorCodeInterface {
	private HttpStatus status;
	private String errorResponseCode;
	private String message;

	@Override
	public ErrorCode toErrorCode() {
		return this;
	}

	public void appendMessage(String additionalMessage) {
		this.message += " " + additionalMessage;
	}

}
