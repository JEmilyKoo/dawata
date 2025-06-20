package com.ssafy.dawata.global.config;

import static org.springframework.http.HttpHeaders.*;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.ssafy.dawata.domain.auth.handler.CustomOAuth2AuthenticationFailureHandler;
import com.ssafy.dawata.domain.auth.handler.CustomOAuth2AuthenticationSuccessHandler;
import com.ssafy.dawata.domain.auth.service.CustomOAuth2UserService;
import com.ssafy.dawata.global.cookie.HttpCookieOAuth2AuthorizationRequestRepository;
import com.ssafy.dawata.global.filter.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

	private final HttpCookieOAuth2AuthorizationRequestRepository httpCookieOAuth2AuthorizationRequestRepository;
	private final CustomOAuth2UserService customOAuth2UserService;

	private final CustomOAuth2AuthenticationSuccessHandler oauth2SuccessHandler;
	private final CustomOAuth2AuthenticationFailureHandler oauth2FailureHandler;

	private final JwtAuthenticationFilter jwtAuthenticationFilter;

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		defaultFilterChain(http);

		return http
			.authorizeHttpRequests(authorize ->
				authorize
					.anyRequest()
					.permitAll()
			)
			.addFilterBefore(
				jwtAuthenticationFilter,
				UsernamePasswordAuthenticationFilter.class
			)
			// .oauth2Login(oauth2 -> oauth2
			// 	.authorizationEndpoint(authorization -> authorization
			// 		.baseUri("/auth/social")
			// 		.authorizationRequestRepository(httpCookieOAuth2AuthorizationRequestRepository)
			// 	)
			// 	.redirectionEndpoint(redirect -> redirect
			// 		.baseUri("/oauth2/callback/*")
			// 	)
			// 	.userInfoEndpoint(userInfo -> userInfo
			// 		.userService(customOAuth2UserService)
			// 	)
			// 	.failureHandler(oauth2FailureHandler)
			// 	.successHandler(oauth2SuccessHandler)
			// )
			.build();
	}

	private void defaultFilterChain(HttpSecurity http) throws Exception {
		http.httpBasic(AbstractHttpConfigurer::disable)
			.formLogin(AbstractHttpConfigurer::disable)
			.csrf(
				csrf -> csrf
					.ignoringRequestMatchers("/api/**")
					.disable()
			)
			.cors(Customizer.withDefaults())
			.sessionManagement(
				session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
			);
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		// TODO: CORS 임시 전체 허용
		configuration.addAllowedOriginPattern("*");

		configuration.addAllowedHeader("*");
		configuration.addAllowedMethod("*");
		configuration.setAllowCredentials(true);
		configuration.addExposedHeader(SET_COOKIE);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}
}
