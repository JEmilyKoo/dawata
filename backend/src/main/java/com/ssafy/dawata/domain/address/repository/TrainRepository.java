package com.ssafy.dawata.domain.address.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.dawata.domain.address.entity.Train;

public interface TrainRepository extends JpaRepository<Train, Long> {

	@Query("""
		SELECT t
		FROM Train t
		WHERE t.latitude BETWEEN :minLatitude AND :maxLatitude
		AND t.longitude BETWEEN :minLongitude AND :maxLongitude
		""")
	List<Train> findTrainByRange(
		@Param("minLatitude") Double minLatitude,
		@Param("maxLatitude") Double maxLatitude,
		@Param("minLongitude") Double minLongitude,
		@Param("maxLongitude") Double maxLongitude
	);

	@Query("""
		SELECT t
		FROM Train t
		WHERE t.name IN ('잠실역', '강남역', '홍대입구역', '구로디지털단지역', '서울역', '건대입구역', '사당역', '종로3가역', '당산역')
		""")
	List<Train> findMostPopularStations();
}
