package com.ssafy.dawata.global.config;

import java.io.ByteArrayInputStream;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

import jakarta.annotation.PostConstruct;

@Service
public class FirebaseConfig {
	@Value("${firebase.type}")
	private String type;

	@Value("${firebase.project_id}")
	private String projectId;

	@Value("${firebase.private_key_id}")
	private String privateKeyId;

	@Value("${firebase.private_key}")
	private String privateKey;

	@Value("${firebase.client_email}")
	private String clientEmail;

	@Value("${firebase.client_id}")
	private String clientId;

	@Value("${firebase.auth_uri}")
	private String authUri;

	@Value("${firebase.token_uri}")
	private String tokenUri;

	@Value("${firebase.auth_provider_x509_cert_url}")
	private String authProviderCertUrl;

	@Value("${firebase.client_x509_cert_url}")
	private String clientCertUrl;


	@PostConstruct
	public void initialize() {
		try {
			FirebaseOptions options = FirebaseOptions.builder()
				.setCredentials(GoogleCredentials.fromStream(new ByteArrayInputStream(getFirebaseToByteArr())))
				.build();

			if (FirebaseApp.getApps().isEmpty()) {
				FirebaseApp.initializeApp(options);
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	private byte[] getFirebaseToByteArr() {
		return String.format(
			"{" +
				"\"type\": \"%s\"," +
				"\"project_id\": \"%s\"," +
				"\"private_key_id\": \"%s\"," +
				"\"private_key\": \"%s\"," +
				"\"client_email\": \"%s\"," +
				"\"client_id\": \"%s\"," +
				"\"auth_uri\": \"%s\"," +
				"\"token_uri\": \"%s\"," +
				"\"auth_provider_x509_cert_url\": \"%s\"," +
				"\"client_x509_cert_url\": \"%s\"" +
				"}",
			type, projectId, privateKeyId, privateKey.replace("\n", "\\n"),
			clientEmail, clientId, authUri, tokenUri,
			authProviderCertUrl, clientCertUrl
		).getBytes();
	}
}


