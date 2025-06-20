package com.ssafy.dawata.global.filter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.ssafy.dawata.domain.auth.entity.SecurityMemberDetails;
import com.ssafy.dawata.domain.member.entity.Member;
import com.ssafy.dawata.global.jwt.JwtTokenProvider;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtTokenProvider tokenProvider;

	@Override
	protected void doFilterInternal(
		HttpServletRequest request,
		HttpServletResponse response,
		FilterChain filterChain
	) throws ServletException, IOException {
		String token = request.getHeader("Authorization");

		// 토큰이 없거나 이상하면 -> 익명권한 부여
		if(token == null || !token.startsWith("Bearer ")){
			// 권한 부여, Role -> {"ROLE_ANONYMOUS"}
			Collection<GrantedAuthority> authorities = new ArrayList<>();
			authorities.add((GrantedAuthority) () -> "ROLE_ANONYMOUS");

			// 익명 사용자는 테스터 계정
			Authentication authentication = new UsernamePasswordAuthenticationToken(
				new SecurityMemberDetails(
					Member.createMember(1L, "test@email.com", "테스터")
				), null, authorities);

			// SecurityContextHolder에 Authentication 객체 저장
			SecurityContextHolder.getContext().setAuthentication(authentication);
			filterChain.doFilter(request, response);
			return;
		}

		token = token.substring(7);
		// 정상 토큰 검사
		if(tokenProvider.validate(token)) {
			UsernamePasswordAuthenticationToken authentication = tokenProvider.decode(token);
			SecurityContextHolder.getContext().setAuthentication(authentication);
			filterChain.doFilter(request, response);
		}
	}
}
