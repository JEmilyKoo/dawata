package com.ssafy.dawata.domain.common.exception;

import com.ssafy.dawata.domain.common.error.ErrorCode;
import com.ssafy.dawata.domain.common.error.ErrorCodeInterface;

import lombok.Getter;

@Getter
public class BusinessException extends RuntimeException {
	private final ErrorCode errorCode;

	public <T extends ErrorCodeInterface> BusinessException(T errorCode) {
		super(errorCode.getMessage());
		this.errorCode = errorCode.toErrorCode();
	}

	public <T extends ErrorCodeInterface> BusinessException(T errorCode, String additionalMessage) {
		this.errorCode = errorCode.toErrorCode();
		this.errorCode.appendMessage(additionalMessage);
	}
}
