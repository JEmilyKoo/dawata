package com.ssafy.dawata.domain.auth.entity;

import java.util.Collection;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import com.ssafy.dawata.domain.member.entity.Member;

import lombok.Getter;

public record MemberPrincipal(
	Long id,
	String email,
	String name,
	Collection<? extends GrantedAuthority> authorities,
	Map<String, Object> oAuth2Attributes
) implements UserDetails, OAuth2User {

	public static MemberPrincipal of(
		Long id,
		String email,
		String name,
		Map<String, Object> oAuth2Attributes
	) {
		Set<RoleType> roleTypes = Set.of(RoleType.MEMBER);
		return of(
			id,
			email,
			name,
			roleTypes
				.stream()
				.map(RoleType::getName)
				.map(SimpleGrantedAuthority::new)
				.collect(Collectors.toUnmodifiableSet()),
			oAuth2Attributes
		);
	}

	public static MemberPrincipal of(
		Long id,
		String email,
		String name,
		Collection<? extends GrantedAuthority> authorities,
		Map<String, Object> oAuth2Attributes
	) {
		return new MemberPrincipal(
			id,
			email,
			name,
			authorities,
			oAuth2Attributes
		);
	}

	public static MemberPrincipal from(Member entity,
		Map<String, Object> oAuth2Attributes) {
		return MemberPrincipal.of(
			entity.getId(),
			entity.getEmail(),
			entity.getName(),
			oAuth2Attributes
		);
	}

	// public MemberAccountDto toDto() {
	// 	return MemberAccountDto.builder()
	// 		.memberId(memberId)
	// 		.email(email)
	// 		.name(nickname)
	// 		.build();
	// }

	// -- OAuth2User -- //
	@Override
	public String getName() {
		return email;
	}

	@Override
	public Map<String, Object> getAttributes() {
		return oAuth2Attributes;
	}

	// -- UserDetails -- //
	@Override
	public String getUsername() {
		return email;
	}

	@Override
	public String getPassword() {
		return null;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return authorities;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}

	@Getter
	public enum RoleType {
		MEMBER("ROLE_MEMBER");

		private final String name;

		RoleType(String name) {
			this.name = name;
		}
	}
}