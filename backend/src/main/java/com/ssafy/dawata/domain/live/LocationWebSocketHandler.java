package com.ssafy.dawata.domain.live;

import java.io.IOException;
import java.util.Collections;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class LocationWebSocketHandler extends TextWebSocketHandler {

	private final StringRedisTemplate redisTemplate;
	private final Map<String, Set<WebSocketSession>> sessionMap = new ConcurrentHashMap<>();

	public LocationWebSocketHandler(StringRedisTemplate redisTemplate) {
		this.redisTemplate = redisTemplate;
	}

	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		String appointmentId = extractAppointmentId(session);
		sessionMap.computeIfAbsent(appointmentId, k -> ConcurrentHashMap.newKeySet()).add(session);
	}

	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		String appointmentId = extractAppointmentId(session);
		String payload = message.getPayload();

		// 좌표 데이터를 Redis Pub/Sub으로 발행
		redisTemplate.convertAndSend("appointment:" + appointmentId, payload);
	}

	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		sessionMap.getOrDefault(
			extractAppointmentId(session),
			Collections.emptySet()
		).remove(session);
	}

	private String extractAppointmentId(WebSocketSession session) {
		return session.getUri().getPath().split("/")[2];
	}

	public void broadcast(String appointmentId, String message) throws IOException {
		Set<WebSocketSession> sessions = sessionMap.get(appointmentId);

		if (sessions != null) {
			for (WebSocketSession session : sessions) {
				session.sendMessage(new TextMessage(message));
			}
		}
	}
}
