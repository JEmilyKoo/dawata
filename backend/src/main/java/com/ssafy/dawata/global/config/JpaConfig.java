package com.ssafy.dawata.global.config;

import java.util.Optional;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import com.ssafy.dawata.domain.auth.entity.SecurityMemberDetails;

@Configuration
@EnableJpaAuditing
public class JpaConfig {

	@Bean
	public AuditorAware<String> auditorAware() {
		return () -> Optional.ofNullable(SecurityContextHolder.getContext())
			.map(SecurityContext::getAuthentication)
			.filter(Authentication::isAuthenticated)
			.map(Authentication::getPrincipal)
			.map(SecurityMemberDetails.class::cast)
			.map(SecurityMemberDetails::getUserEmail);
	}
}
