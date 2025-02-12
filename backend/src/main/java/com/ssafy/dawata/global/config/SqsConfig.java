package com.ssafy.dawata.global.config;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.client.config.ClientAsyncConfiguration;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.sqs.SqsAsyncClient;
import software.amazon.awssdk.core.client.config.SdkAdvancedAsyncClientOption;


@Configuration
public class SqsConfig {

	@Value("${aws.credentials.access-key}")
	private String accessKey;

	@Value("${aws.credentials.secret-key}")
	private String secretKey;

	@Value("${aws.credentials.region.static}")
	private String region;

	@Bean
	public SqsAsyncClient sqsAsyncClient() {
		ExecutorService executorService = Executors.newFixedThreadPool(5);

		return SqsAsyncClient.builder()
			.region(Region.AP_NORTHEAST_2)  // AWS 리전 설정
			.credentialsProvider(StaticCredentialsProvider.create(
				AwsBasicCredentials.create(accessKey, secretKey)
			))
			.asyncConfiguration(
				ClientAsyncConfiguration.builder()
					.advancedOption(SdkAdvancedAsyncClientOption.FUTURE_COMPLETION_EXECUTOR, executorService)
					.build()
			)
			.build();
	}
}
