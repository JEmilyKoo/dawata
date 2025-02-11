package com.ssafy.dawata.domain.photo.service;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import software.amazon.awssdk.services.sqs.SqsAsyncClient;
import software.amazon.awssdk.services.sqs.model.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.atomic.AtomicBoolean;

import com.google.gson.Gson;

@Service
@RequiredArgsConstructor
public class SqsService {
	private final Gson gson;
	private final SqsAsyncClient sqsAsyncClient;
	private final PhotoService photoService;

	@Value("${aws.sqs.queue-url}")
	private String queueUrl;

	// 폴링을 안전하게 제거하기 위한 변수
	private final AtomicBoolean running =
		new AtomicBoolean(true);

	@PostConstruct
	public void startPolling() {
		pollMessages();
	}

	@PreDestroy
	public void shutdown() {
		running.set(false);

		sqsAsyncClient.close();
	}

	private void pollMessages() {
		ReceiveMessageRequest request = ReceiveMessageRequest.builder()
			.queueUrl(queueUrl)
			.waitTimeSeconds(20)          // Long Polling 활성화
			.maxNumberOfMessages(5)       // 한 번에 최대 5개 메시지 수신
			.build();

		CompletableFuture<ReceiveMessageResponse> future = sqsAsyncClient.receiveMessage(request);

		// 성공 처리
		future.thenAccept(response -> {
				List<Message> messages = response.messages();
				if (!messages.isEmpty()) {
					messages.forEach(this::processMessage);
				}

				pollMessages();  // 계속 폴링 유지
			})

			// 실패 처리
			.exceptionally(ex -> {
				System.err.println("❌ 메시지 수신 실패: " + ex.getMessage());
				ex.printStackTrace();
				try {
					Thread.sleep(5000);  // 실패 시 5초 대기 후 재시도
				} catch (InterruptedException ignored) {
				}
				pollMessages();  // 실패 후에도 재시도
				return null;
			});
	}

	private void processMessage(Message message) {
		if (!running.get()) {
			return;
		}

		try {
			// 메시지 처리 로직
			handleEvent(message.body());

			// 메시지 삭제 (중복 방지)
			deleteMessage(message.receiptHandle());
		} catch (Exception e) {
			System.err.println("❗ 메시지 처리 중 오류 발생: " + e.getMessage());
			e.printStackTrace();
		}
	}

	private void deleteMessage(String receiptHandle) {
		DeleteMessageRequest deleteRequest = DeleteMessageRequest.builder()
			.queueUrl(queueUrl)
			.receiptHandle(receiptHandle)
			.build();

		sqsAsyncClient.deleteMessage(deleteRequest)
			.exceptionally(ex -> {
				System.err.println("❌ 메시지 삭제 실패: " + ex.getMessage());
				return null;
			});
	}

	private void handleEvent(String eventJson) {
		try {
			Map<String, Object> eventMap = gson.fromJson(eventJson, Map.class);
			List<Map<String, Object>> records = (List<Map<String, Object>>)eventMap.get("Records");

			for (Map<String, Object> record : records) {
				Map<String, Object> s3 = (Map<String, Object>)record.get("s3");
				Map<String, Object> object = (Map<String, Object>)s3.get("object");
				String event = record.get("eventName").toString().split(":")[1];
				String photoName = object.get("key").toString().replaceAll("%3A", ":");

				switch (event.toUpperCase()) {
					case "PUT" -> {
						photoService.savePhoto(photoName);
					}
					case "DELETE" -> {
						photoService.removePhoto(photoName);
					}
				}
			}
		} catch (Exception e) {
			System.err.println("❗ 이벤트 처리 중 오류 발생: " + e.getMessage());
		}
	}
}
