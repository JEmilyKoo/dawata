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

	/**
	 * 지정된 파일에 대한 Presigned URL을 생성합니다.
	 *
	 * @param fileName       파일의 이름.
	 *                       - {@code null}인 경우 파일 이름 새로 생성. -> Create,
	 *                       - {@code null}이 아닌 경우 해당 이름으로 파일 이름 유지. -> Update, Get, Delete
	 * @param method         요청 메서드 유형. ("get", "put", "delete")
	 * @param entityCategory 엔터티의 카테고리. ("MEMBER", "FEED", "CLUB", "CLUB_MEMBER","APPOINTMENT")
	 * @return 생성된 Presigned URL을 반환합니다.
	 */
	public URL generatePresignedUrl(
		String fileName,
		String method,
		EntityCategory entityCategory,
		Long entityId
	) {

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
						.key(createImageName(fileName, entityCategory, entityId))
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

	/**
	 * image 이름 설정 메소드.
	 *
	 * @param fileName 파일 이름 <br>
	 * 					- {@code null} : 파일 이름 새로 생성. <br>
	 *                 	- {@code notNull} : 아닌 경우 해당 이름으로 return <br>
	 * @param entityCategory 엔터티의 카테고리. ("MEMBER", "CLUB", "APPOINTMENT")
	 * */
	private static String createImageName(String fileName, EntityCategory entityCategory, Long entityId) {
		return entityId + "_" + entityCategory + "_" + LocalDateTime.now() + "_" + fileName + ".png";
	}
}