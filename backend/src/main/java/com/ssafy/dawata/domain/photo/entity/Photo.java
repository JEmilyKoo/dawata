package com.ssafy.dawata.domain.photo.entity;

import java.time.LocalDateTime;

import com.ssafy.dawata.domain.common.entity.BaseTimeEntity;
import com.ssafy.dawata.domain.photo.enums.EntityCategory;
import com.ssafy.dawata.domain.photo.enums.EntityCategoryConverter;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Photo extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String photoName;

	@Column(nullable = false)
	@Convert(converter = EntityCategoryConverter.class)
	private EntityCategory entityCategory;

	@Column(nullable = false)
	private Long entityId;

	@Builder(access = AccessLevel.PRIVATE)
	public Photo(String photoName, EntityCategory entityCategory, Long entityId) {
		this.photoName = photoName;
		this.entityCategory = entityCategory;
		this.entityId = entityId;
	}

	public static Photo createPhoto(String photoName, EntityCategory entityCategory, Long entityId) {
		return Photo.builder()
			.photoName(photoName)
			.entityCategory(entityCategory)
			.entityId(entityId)
			.build();
	}

	// photo table 에 데이터는 없지만 기본 이미지
	public static Photo createDefaultPhoto(Long entityId, EntityCategory entityCategory) {
		return Photo.builder()
			.photoName(((entityId % 8) + 1) + "_" + entityCategory + "_" + "default.png")
			.build();
	}

	public void updatePhotoName(String photoName) {
		this.photoName = photoName;
	}
}
