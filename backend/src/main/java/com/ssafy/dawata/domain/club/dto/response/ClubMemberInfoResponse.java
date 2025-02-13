package com.ssafy.dawata.domain.club.dto.response;

import com.ssafy.dawata.domain.club.entity.ClubMember;
import com.ssafy.dawata.domain.photo.entity.Photo;
import com.ssafy.dawata.domain.photo.enums.EntityCategory;
import com.ssafy.dawata.domain.photo.repository.PhotoRepository;

import io.swagger.v3.oas.annotations.media.Schema;

import java.net.URL;
import java.time.LocalDateTime;
import java.util.Optional;

public record ClubMemberInfoResponse(
	@Schema(description = "클럽 내 멤버로서의 Pk")
	Long clubMemberId, //이름 변경 (클럽 내 멤버로서의 pk)
	@Schema(description = "클럽 회원의 member테이블 pk")
	Long memberId,
	@Schema(description = "클럽 아이디. 클럽 테이블의 pk")
	Long clubId,
	@Schema(description = "멤버의 이름")
	String name,
	@Schema(description = "클럽 내 클라이언트의 닉네임")
	String nickname,
	@Schema(description = "사용자가 볼 클럽명")
	String clubName,
	@Schema(description = "사용자의 클럽 내 역할. 0이 관리자, 1이 일반 멤버")
	int role,
	@Schema(description = "사용자의 이메일")
	String email,

	@Schema(description = "사용자의 그룹 가입일")
	LocalDateTime createdAt,

	@Schema(description = "사용자의 이미지 파일명")
	String imageName,

	@Schema(description = "사용자의 이미지 URL")
	URL imageURL

) {
	public static ClubMemberInfoResponse from(ClubMember clubMember, String imageName, URL imageURL) {
		return new ClubMemberInfoResponse(
			clubMember.getId(),
			clubMember.getMember().getId(),
			clubMember.getClub().getId(),
			clubMember.getMember().getName(),
			clubMember.getNickname(),
			clubMember.getClubName(),
			clubMember.getRole(),
			clubMember.getMember().getEmail(),
			clubMember.getCreatedAt(),
			imageName,
			imageURL
		);
	}
}
