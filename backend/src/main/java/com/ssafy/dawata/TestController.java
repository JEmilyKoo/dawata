package com.ssafy.dawata;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.dawata.domain.vote.entity.VoteItem;
import com.ssafy.dawata.domain.vote.repository.VoteItemRepository;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/test")
public class TestController {
	private final VoteItemRepository voteItemRepository;

	@Operation(summary = "test", description = "test")
	@GetMapping("/{id}")
	public void test(@PathVariable("id") Long id) {
		List<VoteItem> voteItemByMaxCount = voteItemRepository.findVoteItemByMaxCount(id);

		for (VoteItem vi : voteItemByMaxCount) {
			System.out.println(vi.getAddress().getLatitude());
			System.out.println(vi.getAddress().getLongitude());
		}
	}
}
