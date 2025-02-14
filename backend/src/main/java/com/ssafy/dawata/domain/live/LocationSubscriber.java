package com.ssafy.dawata.domain.live;

import java.util.Map;

import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.PatternTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.dawata.domain.common.service.RedisService;
import com.ssafy.dawata.domain.live.dto.TMapResponse;
import com.ssafy.dawata.domain.live.dto.request.LiveRequest;
import com.ssafy.dawata.domain.live.dto.response.LiveResponse;
import com.ssafy.dawata.domain.live.enums.ArrivalState;
import com.ssafy.dawata.domain.live.enums.RedisKeyCategory;
import com.ssafy.dawata.domain.live.service.SkOpenApiService;

@Component
public class LocationSubscriber implements MessageListener {
	private final int A_DAY = 60 * 60 * 24;

	private final LocationWebSocketHandler webSocketHandler;
	private final ObjectMapper objectMapper = new ObjectMapper();
	private final SkOpenApiService skOpenApiService;
	private final RedisService redisService;
	private final RedisTemplate<String, String> redisTemplateForOthers;
	private final RedisTemplate<String, Object> redisTemplateForLiveLocation;

	public LocationSubscriber(
		LocationWebSocketHandler webSocketHandler,
		RedisMessageListenerContainer container,
		SkOpenApiService skOpenApiService, RedisService redisService,
		RedisTemplate<String, String> redisTemplateForOthers, RedisTemplate<String, Object> redisTemplateForLiveLocation
	) {
		this.webSocketHandler = webSocketHandler;
		this.redisTemplateForLiveLocation = redisTemplateForLiveLocation;
		container.addMessageListener(this, new PatternTopic("appointment:*"));
		this.skOpenApiService = skOpenApiService;
		this.redisService = redisService;
		this.redisTemplateForOthers = redisTemplateForOthers;
	}

	// TODO(고) : 추후 에러 처리 예정
	@Override
	public void onMessage(Message message, byte[] pattern) {
		// message의 channel
		String channel = new String(message.getChannel());
		String appointmentId = channel.split(":")[1];

		try {
			LiveRequest liveRequest =
				objectMapper.readValue(new String(message.getBody()), LiveRequest.class);

			String[] arrivals = redisService.getData(
				redisTemplateForOthers,
				RedisKeyCategory.VOTE_RESULT.getKey() + appointmentId
			).split(",");

			// TODO(고) : redis에 해당 유저의 위치를 저장
			redisService.updateDataUseTTL(
				redisTemplateForLiveLocation,
				String.format(
					RedisKeyCategory.LIVE_LOCATION.getKey(),
					new Object[]{Long.parseLong(appointmentId), liveRequest.memberId()}
				),
				liveRequest.latitude()+","+ liveRequest.longitude(),
				A_DAY
			);


			// t map에 길찾기 요청 (걷는 기준)
			Map<String, Object> json = skOpenApiService.getWalkingRoute(
				liveRequest.latitude(),
				liveRequest.longitude(),
				Double.parseDouble(arrivals[1]),
				Double.parseDouble(arrivals[2])
			);

			TMapResponse tMapResponse =
				objectMapper.convertValue(json, TMapResponse.class);

			if (tMapResponse.getFeatures() != null && !tMapResponse.getFeatures().isEmpty()) {
				int totalDistance = tMapResponse.getFeatures().get(0).getProperties().getTotalDistance();
				int totalTime = tMapResponse.getFeatures().get(0).getProperties().getTotalTime();

				webSocketHandler.broadcast(
					appointmentId,
					objectMapper.writeValueAsString(
						LiveResponse.of(
							liveRequest,
							totalDistance < 100 ?
								ArrivalState.ARRIVED :
								ArrivalState.NOT_ARRIVED,
							totalTime)
					)
				);

			} else {
				throw new IllegalArgumentException("데이터를 전달할 수 없습니다.");
			}
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}
}
