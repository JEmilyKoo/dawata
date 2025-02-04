package com.ssafy.dawata.domain.common.service;

import java.net.URL;
import java.time.Duration;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.ssafy.dawata.domain.photo.enums.EntityCategory;

import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

@Service
@RequiredArgsConstructor
public class S3Service {

	private final S3Presigner s3Presigner;

	@Value("${aws.s3.bucket}")
	private String bucketName;

	@Value("${aws.s3.presigned-url-expiration}")
	private int expirationMinutes;

	public URL generatePresignedUrl(
		String fileName,
		String method,
		EntityCategory entityCategory) {

		// 공통으로 사용하는 빌더 초기화
		Duration expiration = Duration.ofMinutes(expirationMinutes);

		switch (method.toUpperCase()) {
			case "GET":
				return s3Presigner.presignGetObject(builder -> builder
					.getObjectRequest(GetObjectRequest.builder()
						.bucket(bucketName)
						.key(fileName)
						.responseContentType("image/png")
						.build())
					.signatureDuration(expiration)
				).url();

			case "PUT":
				return s3Presigner.presignPutObject(builder -> builder
					.putObjectRequest(PutObjectRequest.builder()
						.bucket(bucketName)
						.key(createImageName(entityCategory))
						.contentType("image/png")
						.build())
					.signatureDuration(expiration)
				).url();

			case "DELETE":
				return s3Presigner.presignDeleteObject(builder -> builder
					.deleteObjectRequest(DeleteObjectRequest.builder()
						.bucket(bucketName)
						.key(fileName)
						.build())
					.signatureDuration(expiration)
				).url();

			default:
				throw new IllegalArgumentException("지원하지 않는 HTTP 메서드입니다: " + method);
		}
	}

	private static String createImageName(EntityCategory entityCategory) {
		return entityCategory + "_" + LocalDateTime.now() + "_" + "userEmail" + ".png";
	}
}