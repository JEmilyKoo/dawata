package com.ssafy.dawata.domain.photo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.dawata.domain.photo.entity.Photo;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {
	void deleteByPhotoName(String photoName);

	Optional<Photo> findByEntityId(Long entityId);
}