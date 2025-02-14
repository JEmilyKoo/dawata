package com.ssafy.dawata.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceClientConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.PatternTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import com.ssafy.dawata.domain.common.service.ExpiredEventListener;

@EnableCaching
@Configuration
public class RedisConfig {

	@Value("${spring.data.redis.host}")
	private String host;

	@Value("${spring.data.redis.port}")
	private int port;

	// TODO(고성태) : redisConnectionFactoryUseDBNumber로 전환 예정
	@Bean
	public RedisConnectionFactory redisConnectionFactory() {
		RedisStandaloneConfiguration redisStandaloneConfiguration = new RedisStandaloneConfiguration();
		redisStandaloneConfiguration.setHostName(host);
		redisStandaloneConfiguration.setPort(port);
		return new LettuceConnectionFactory(redisStandaloneConfiguration);
	}

	// TODO(고성태) : redisTemplateForJWT로 전환 예정
	@Bean
	public RedisTemplate<String, String> redisTemplate() {
		RedisTemplate<String, String> redisTemplate = new RedisTemplate<>();
		redisTemplate.setConnectionFactory(redisConnectionFactory());
		redisTemplate.setKeySerializer(new StringRedisSerializer());
		redisTemplate.setValueSerializer(new StringRedisSerializer());
		return redisTemplate;
	}

	public RedisConnectionFactory redisConnectionFactoryUseDBNumber(int databaseIndex) {
		RedisStandaloneConfiguration redisStandaloneConfiguration = new RedisStandaloneConfiguration();
		redisStandaloneConfiguration.setHostName(host);
		redisStandaloneConfiguration.setPort(port);
		redisStandaloneConfiguration.setDatabase(databaseIndex);

		LettuceConnectionFactory lettuceConnectionFactory =
			new LettuceConnectionFactory(
				redisStandaloneConfiguration,
				LettuceClientConfiguration.builder().build());
		lettuceConnectionFactory.afterPropertiesSet();
		return lettuceConnectionFactory;
	}

	/**
	 * JWT 관리용 Redis
	 * */
	@Bean
	public RedisTemplate<String, String> redisTemplateForJWT() {
		RedisTemplate<String, String> redisTemplate = new RedisTemplate<>();
		redisTemplate.setConnectionFactory(redisConnectionFactoryUseDBNumber(0));
		redisTemplate.setKeySerializer(new StringRedisSerializer());
		redisTemplate.setValueSerializer(new StringRedisSerializer());
		return redisTemplate;
	}

	/**
	 * live 위치 Redis
	 * */
	@Bean
	public RedisTemplate<String, Object> redisTemplateForLiveLocation() {
		RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
		redisTemplate.setConnectionFactory(redisConnectionFactoryUseDBNumber(1));
		redisTemplate.setKeySerializer(new StringRedisSerializer());
		redisTemplate.setValueSerializer(new GenericJackson2JsonRedisSerializer());
		return redisTemplate;
	}

	/**
	 * 나머지 처리 Redis
	 * */
	@Bean
	public RedisTemplate<String, String> redisTemplateForOthers() {
		RedisTemplate<String, String> redisTemplate = new RedisTemplate<>();
		redisTemplate.setConnectionFactory(redisConnectionFactoryUseDBNumber(2));
		redisTemplate.setKeySerializer(new StringRedisSerializer());
		redisTemplate.setValueSerializer(new GenericJackson2JsonRedisSerializer());
		return redisTemplate;
	}

	/**
	 * 만료 이벤트 설정
	 * */
	@Bean
	public RedisMessageListenerContainer redisContainer(
		RedisConnectionFactory connectionFactory,
		ExpiredEventListener expiredEventListener
	) {
		RedisMessageListenerContainer container = new RedisMessageListenerContainer();
		container.setConnectionFactory(connectionFactory);

		// 키 만료 이벤트 리스너 추가
		container.addMessageListener(
			expiredEventListener,
			new PatternTopic("__keyevent@2__:expired"));
		return container;
	}
}
