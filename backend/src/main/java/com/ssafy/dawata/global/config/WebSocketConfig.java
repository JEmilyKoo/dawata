package com.ssafy.dawata.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import com.ssafy.dawata.domain.live.LocationWebSocketHandler;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

	private final LocationWebSocketHandler webSocketHandler;

	public WebSocketConfig(LocationWebSocketHandler webSocketHandler) {
		this.webSocketHandler = webSocketHandler;
	}

	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		registry.addHandler(webSocketHandler, "/appointment/{appointmentId}")
			.setAllowedOrigins("*");  // 모든 도메인에서 접근 허용
	}
}
