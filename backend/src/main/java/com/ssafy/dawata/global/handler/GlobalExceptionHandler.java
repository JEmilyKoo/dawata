package com.ssafy.dawata.global.handler;

import java.sql.SQLException;

import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;

import com.ssafy.dawata.domain.common.dto.ErrorResponse;
import com.ssafy.dawata.domain.common.error.CommonErrorCode;
import com.ssafy.dawata.domain.common.exception.BusinessException;
import com.ssafy.dawata.domain.common.exception.NotFoundException;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(HttpClientErrorException.Forbidden.class)
	protected ResponseEntity<ErrorResponse> handleForbiddenException(
		final HttpClientErrorException.Forbidden e,
		final HttpServletRequest request
	) {
		log.error("ForbiddenException: {}", e.getMessage());
		return ErrorResponse.toResponseEntity(CommonErrorCode.FORBIDDEN);
	}

	@ExceptionHandler(BusinessException.class)
	protected ResponseEntity<ErrorResponse> handleBusinessException(
		final BusinessException e,
		final HttpServletRequest request
	) {
		log.error("BusinessException: {}", e.getMessage());
		return ErrorResponse.toResponseEntity(e.getErrorCode());
	}

	@ExceptionHandler(NotFoundException.class)
	protected ResponseEntity<ErrorResponse> handleNotFoundException(
		final NotFoundException e
	) {
		log.error("NotFoundException: {}", e.getMessage());
		return ErrorResponse.toResponseEntity(e.getErrorCode());
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	protected ResponseEntity<ErrorResponse> handleMethodArgumentNotValidException(
		final MethodArgumentNotValidException e,
		final HttpServletRequest request
	) {
		ErrorResponse errorResponse = ErrorResponse.builder()
			.errorResponseCode(CommonErrorCode.METHOD_ARGUMENT_NOT_VALID.getErrorResponseCode())
			.status(CommonErrorCode.METHOD_ARGUMENT_NOT_VALID.getStatus().value())
			.message(e.getAllErrors().get(0).getDefaultMessage()).build();

		return ResponseEntity
			.status(CommonErrorCode.METHOD_ARGUMENT_NOT_VALID.getStatus().value())
			.body(errorResponse);
	}

	@ExceptionHandler(HttpRequestMethodNotSupportedException.class)
	protected ResponseEntity<ErrorResponse> handleMethodNotSupportException() {
		return ErrorResponse.toResponseEntity(CommonErrorCode.METHOD_NOT_ALLOWED);
	}

	@ExceptionHandler
	protected ResponseEntity<ErrorResponse> handleInternalException(
		final Exception e,
		final HttpServletRequest request
	) {
		e.printStackTrace();
		return ErrorResponse.toResponseEntity(CommonErrorCode.INTERNAL_SERVER_ERROR);
	}
}
