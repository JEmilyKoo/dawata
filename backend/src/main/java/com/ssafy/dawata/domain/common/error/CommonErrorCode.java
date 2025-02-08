package com.ssafy.dawata.domain.common.error;

import org.springframework.http.HttpStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum CommonErrorCode implements ErrorCodeInterface {
	/*
	 * Basic Client Error
	 */
	BAD_REQUEST(HttpStatus.BAD_REQUEST, "COMMON_BAD_REQUEST", "The request could not be understood or was missing required parameters."),
	METHOD_ARGUMENT_NOT_VALID(HttpStatus.BAD_REQUEST,  "Method Argument Not Valid", "One or more method arguments are not valid."),
	UNAUTHORIZED(HttpStatus.UNAUTHORIZED,  "Unauthenticated", "Authentication is required and has failed or has not been provided."),
	FORBIDDEN(HttpStatus.FORBIDDEN, "COMMON_FORBIDDEN",  "Access to the requested resource is forbidden."),
	NOT_FOUND(HttpStatus.NOT_FOUND, "COMMON_NOT_FOUND", "The requested resource could not be found."),
	METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "COMMON_METHOD_NOT_ALLOWED",  "The method received in the request-line is known by the origin server but not supported."),
	CONFLICT(HttpStatus.CONFLICT, "COMMON_CONFLICT", "The request could not be completed due to a conflict with the current state of the target resource."),

	/*
	 * StreetDrop Common Error
	 */
	CANNOT_USE_BANNED_WORD(HttpStatus.BAD_REQUEST, "COMMON_CAN_NOT_USE_BANNED_WORD", "Cannot Use Banned Word"),

	/*
	 * Basic Server Error
	 */
	INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "COMMON_INTERNAL_SERVER_ERROR", "An unexpected error occurred"),
	NOT_IMPLEMENTED(HttpStatus.NOT_IMPLEMENTED, "COMMON_NOT_IMPLEMENTED", "The server does not support the functionality required to fulfill the request."),
	UNSUPPORTED_TYPE(HttpStatus.BAD_REQUEST, "COMMON_UNSUPPORTED_TYPE", "The type specified is not supported."),
	SENTENCES_NOT_FOUND(HttpStatus.NOT_FOUND, "COMMON_SENTENCES_NOT_FOUND", "No sentences available in the database");

	private final HttpStatus status;
	private final String errorResponseCode;
	private final String message;

	@Override
	public ErrorCode toErrorCode() {
		return ErrorCode
			.builder()
			.status(status)
			.errorResponseCode(errorResponseCode)
			.message(message)
			.build();
	}
}
