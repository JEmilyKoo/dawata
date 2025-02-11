package com.ssafy.dawata.domain.live;

import java.io.IOException;

import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.listener.PatternTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.dawata.domain.live.dto.request.LiveRequest;
import com.ssafy.dawata.domain.live.dto.response.LiveResponse;
import com.ssafy.dawata.domain.live.enums.ArrivalState;

@Component
public class LocationSubscriber implements MessageListener {

	private final LocationWebSocketHandler webSocketHandler;
	private final ObjectMapper objectMapper = new ObjectMapper();

	public LocationSubscriber(LocationWebSocketHandler webSocketHandler, RedisMessageListenerContainer container) {
		this.webSocketHandler = webSocketHandler;
		container.addMessageListener(this, new PatternTopic("appointment:*"));
	}

	// TODO : 추후 에러 처리 예정
	@Override
	public void onMessage(Message message, byte[] pattern) {
		// message의 channel
		String channel = new String(message.getChannel());
		String appointmentId = channel.split(":")[1];

		try {
			LiveRequest liveRequest =
				objectMapper.readValue(new String(message.getBody()), LiveRequest.class);

			/*
			 * TODO :
			 *  1. 도착 check
			 *  2. 도착 예정 시간
			 * */
			webSocketHandler.broadcast(
				appointmentId,
				objectMapper.writeValueAsString(
					LiveResponse.of(
						liveRequest,
						ArrivalState.ARRIVED,
						null)
				)
			);
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}
}
