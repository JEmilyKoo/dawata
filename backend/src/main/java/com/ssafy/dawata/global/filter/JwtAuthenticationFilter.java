package com.ssafy.dawata.global.filter;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.ssafy.dawata.domain.auth.entity.SecurityMemberDetails;
import com.ssafy.dawata.domain.member.entity.Member;
import com.ssafy.dawata.domain.member.repository.MemberRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final MemberRepository memberRepository;

	@Override
	protected void doFilterInternal(
		HttpServletRequest request,
		HttpServletResponse response,
		FilterChain filterChain
	) throws ServletException, IOException {

		// TODO: JWT 토큰 검증
		Member member = memberRepository.findById(1L)
			.orElseThrow(() -> new IllegalArgumentException("나중에 변경 예정"));
		UserDetails userDetails = new SecurityMemberDetails(member);
		UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
			userDetails, null, null
		);

		SecurityContextHolder.getContext().setAuthentication(authentication);

		filterChain.doFilter(request, response);
	}
}
