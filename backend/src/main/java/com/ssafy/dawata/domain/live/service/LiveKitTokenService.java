package com.ssafy.dawata.domain.live.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import io.livekit.server.AccessToken;
import io.livekit.server.RoomJoin;
import io.livekit.server.RoomName;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class LiveKitTokenService {

	@Value("${livekit.api.key}")
	private String API_KEY;

	@Value("${livekit.api.secret}")
	private String API_SECRET;

	public String getLiveKitToken(Long appointmentId, String email) {
		AccessToken token = new AccessToken(API_KEY, API_SECRET);
		token.setName(email);
		token.setIdentity(email);
		token.addGrants(new RoomJoin(true), new RoomName(String.valueOf(appointmentId)));

		return token.toJwt();
	}

}
