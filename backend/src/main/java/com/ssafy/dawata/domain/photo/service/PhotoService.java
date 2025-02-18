package com.ssafy.dawata.domain.photo.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.dawata.domain.photo.entity.Photo;
import com.ssafy.dawata.domain.photo.enums.EntityCategory;
import com.ssafy.dawata.domain.photo.repository.PhotoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PhotoService {
	private final PhotoRepository photoRepository;

	@Transactional
	public void savePhoto(String photoName) {
		String[] strArr = photoName.split("_");
		
		Long entityId = Long.parseLong(strArr[0]);
		EntityCategory entityCategory = EntityCategory.valueOf(strArr[1]);

		photoRepository.findByEntityIdAndEntityCategory(entityId, entityCategory)
			.ifPresentOrElse(
				photo -> {
					photo.updatePhotoName(photoName);
				},
				() -> {
					Photo photo = Photo.createPhoto(photoName, entityCategory, entityId);
					photoRepository.save(photo);
				}
			);
	}

	@Transactional
	public void removePhoto(String photoName) {
		photoRepository.deleteByPhotoName(photoName);
	}
}
