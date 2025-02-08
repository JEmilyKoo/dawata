package com.ssafy.dawata.domain.common.error;

public sealed interface ErrorCodeCovertInterface permits ErrorCodeInterface {

	/**
	 * Converts this to an ErrorCode object.
	 *
	 * @return An ErrorCode object.
	 */
	ErrorCode toErrorCode();
}
