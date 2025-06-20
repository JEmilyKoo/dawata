package com.ssafy.dawata.domain.auth.dto.response;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Map;

import lombok.Builder;
import lombok.Getter;

@SuppressWarnings("unchecked")
@Getter
public class KakaoOAuth2Response extends OAuth2Response {

	private final Long id;
	private final LocalDateTime connectedAt;
	private final Map<String, Object> properties;
	private final KakaoAccount kakaoAccount;

	@Builder
	public record KakaoAccount(
		Boolean hasEmail,
		Boolean emailNeedsAgreement,
		Boolean isEmailValid,
		Boolean isEmailVerified,
		String email,
		Boolean nameNeedsAgreement,
		String name
	) {

		public static KakaoAccount from(Map<String, Object> attributes) {
			return KakaoAccount.builder()
				.hasEmail(
					Boolean.valueOf(String.valueOf(attributes.get("has_email")))
				)
				.emailNeedsAgreement(
					Boolean.valueOf(
						String.valueOf(attributes.get("email_needs_agreement"))
					)
				)
				.isEmailValid(
					Boolean.valueOf(
						String.valueOf(attributes.get("is_email_valid"))
					)
				)
				.isEmailVerified(
					Boolean.valueOf(
						String.valueOf(attributes.get("is_email_verified"))
					)
				)
				.email(String.valueOf(attributes.get("email")))
				.nameNeedsAgreement(
					Boolean.valueOf(
						String.valueOf(attributes.get("name_needs_agreement"))
					)
				)
				.name(
					String.valueOf(attributes.get("name"))
				)
				.build();
		}
	}

	private KakaoOAuth2Response(Long id, LocalDateTime connectedAt, Map<String, Object> properties,
		KakaoAccount kakaoAccount) {
		this.id = id;
		this.connectedAt = connectedAt;
		this.properties = properties;
		this.kakaoAccount = kakaoAccount;
	}

	public static KakaoOAuth2Response from(Map<String, Object> attributes) {
		return new KakaoOAuth2Response(
			Long.valueOf(String.valueOf(attributes.get("id"))),
			LocalDateTime.parse(
				String.valueOf(attributes.get("connected_at")),
				DateTimeFormatter.ISO_INSTANT.withZone(ZoneId.systemDefault())
			),
			(Map<String, Object>)attributes.get("properties"),
			KakaoAccount.from((Map<String, Object>)attributes.get("kakao_account"))
		);
	}

	// -- OAuth2Response abstract method 구현 -- //
	@Override
	public String id() {
		return String.valueOf(this.id);
	}

	@Override
	public String email() {
		return this.getKakaoAccount().email();
	}

	@Override
	public String name() {
		return this.getKakaoAccount().name();
	}

}
