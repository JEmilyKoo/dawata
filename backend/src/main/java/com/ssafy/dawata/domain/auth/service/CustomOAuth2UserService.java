package com.ssafy.dawata.domain.auth.service;

import java.util.Map;

import javax.swing.text.html.parser.Entity;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.ssafy.dawata.domain.auth.dto.response.KakaoOAuth2Response;
import com.ssafy.dawata.domain.auth.dto.response.OAuth2Response;
import com.ssafy.dawata.domain.auth.entity.SecurityMemberDetails;
import com.ssafy.dawata.domain.member.entity.Member;
import com.ssafy.dawata.domain.member.repository.MemberRepository;
import com.ssafy.dawata.domain.photo.entity.Photo;
import com.ssafy.dawata.domain.photo.enums.EntityCategory;
import com.ssafy.dawata.domain.photo.repository.PhotoRepository;

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

		return createMemberDetails(extractAttributes);
	}

	private SecurityMemberDetails createMemberDetails(
		OAuth2Response extractAttributes
	) {
		String email = extractAttributes.email();

		Member member = memberRepository.findByEmail(email)
			.orElseGet(() -> memberRepository.save(
					Member.createMember(extractAttributes.email(), extractAttributes.name())
				)
			);

		return new SecurityMemberDetails(member);
	}
}
