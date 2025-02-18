package com.ssafy.dawata.domain.fcm.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "fcm request")
public record FcmRequest(
	@Schema(description = "token",
		example = "d_oRqngiTVi5DIlfsgatsI:APA91bFOsRX4mbuMA4yXA-xaAEbZx8PYKQwc49D6m-jBGhyAKWr5LefOVoQVcz4bUeJgFA1FR1K4rJCGiUdEt_mlr1iKvYtRob-E2uMhT78CjK2DGkyvmyk")
	String token
) {
}
