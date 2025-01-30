package com.ssafy.dawata.domain.auth.service;

import java.util.Map;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.ssafy.dawata.domain.auth.dto.response.KakaoOAuth2Response;
import com.ssafy.dawata.domain.auth.dto.response.OAuth2Response;
import com.ssafy.dawata.domain.auth.entity.MemberPrincipal;
import com.ssafy.dawata.domain.member.entity.Member;
import com.ssafy.dawata.domain.member.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

	private final MemberRepository memberRepository;

	@Override
	public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
		OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
		OAuth2User oAuth2User = delegate.loadUser(userRequest);

		OAuth2Response extractAttributes = KakaoOAuth2Response.from(oAuth2User.getAttributes());

		return createMemberPrincipal(extractAttributes, oAuth2User.getAttributes());
	}

	private MemberPrincipal createMemberPrincipal(
		OAuth2Response extractAttributes,
		Map<String, Object> oauth2Attributes
	) {
		String email = extractAttributes.email();

		return MemberPrincipal.from(
			memberRepository
				.findByEmail(email)
				.orElse(
					memberRepository.save(
						Member.createMember(extractAttributes.email(), extractAttributes.name())
					)
				),
			oauth2Attributes
		);
	}
}
