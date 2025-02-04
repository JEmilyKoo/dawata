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
		photoRepository.save(
			Photo.createPhoto(
				photoName,
				EntityCategory.valueOf(strArr[0]),
				1L));
	}

	@Transactional
	public void removePhoto(String photoName) {
		photoRepository.deleteByPhotoName(photoName);
	}
}
