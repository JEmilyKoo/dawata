package com.ssafy.dawata.domain.photo.repository;

import com.ssafy.dawata.domain.photo.entity.Photo;
import com.ssafy.dawata.domain.photo.enums.EntityCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {
    void deleteByPhotoName(String photoName);

    Optional<Photo> findByEntityIdAndEntityCategory(Long entityId, EntityCategory entityCategory);

	boolean existsByPhotoName(String photoName);
}