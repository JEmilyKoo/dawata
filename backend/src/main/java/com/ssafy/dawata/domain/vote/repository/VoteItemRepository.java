package com.ssafy.dawata.domain.vote.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.dawata.domain.vote.entity.VoteItem;

public interface VoteItemRepository extends JpaRepository<VoteItem, Long> {
}
