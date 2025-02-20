import type { Club, ClubCreateInfo } from '@/types/club'

import api from './api'
import { uploadBinaryToS3 } from './s3Api'

//그룹 생성

export const createClub = async (params: ClubCreateInfo) => {
  try {
    const response = await api.post('/clubs', params)
    return response
  } catch (error) {
    return null
  }
}

// 특정 그룹 데이터 조회
interface GetClubParams {
  clubId: number
  nextRange?: number
  prevRange?: number
}

// 전체 그룹 데이터 조회
export const getClubs = async () => {
  try {
    const response = await api.get<Club[]>('/clubs')
    return response.data
  } catch (error) {
    console.error('⛔ 전체 그룹 데이터 조회 실패:')
    return null
  }
}

// 그룹 데이터 수정
interface UpdateClubParams {
  clubId: number
  name: string
  category: string
}

export const updateClub = async ({
  clubId,
  name,
  category,
}: UpdateClubParams) => {
  try {
    const response = await api.patch(`/clubs/${clubId}`, { name, category })
    return response
  } catch (error) {
    console.error('⛔ 그룹 데이터 수정실패:')
    return null
  }
}
// 그룹 삭제

interface DeleteClubParams {
  clubId: number
}

export const deleteClub = async ({ clubId }: DeleteClubParams) => {
  try {
    const response = await api.delete(`/clubs/${clubId}`)
    return response
  } catch (error) {
    console.error('⛔ 그룹 삭제 실패')
    return null
  }
}
// 그룹 코드 조회
interface ClubIdParams {
  clubId: number
}

export const getClubCode = async ({ clubId }: ClubIdParams) => {
  try {
    const response = await api.get(`/clubs/${clubId}/code`)
    return response
  } catch (error) {
    console.error('⛔ 그룹 코드 조회 실패:')
    return null
  }
}

// 클럽 멤버 전체 조회
export const getClubMembers = async ({ clubId }: ClubIdParams) => {
  try {
    const response = await api.get(`/clubs/${clubId}/members`)
    return response
  } catch (error) {
    console.error('⛔ 클럽 멤버 전체 조회 실패:')
    return null
  }
}
// 클럽 멤버 코드로 추가
interface AddMemberByCodeParams {
  clubId: number
  nextRange?: number
  prevRange?: number
}

export const addMemberByCode = async ({
  clubId,
  nextRange = 4,
  prevRange = 4,
}: AddMemberByCodeParams) => {
  try {
    const response = await api.get(`/appointments`, {
      params: { clubId, nextRange, prevRange },
    })
    return [
      { id: 1, title: '약속1' },
      { id: 2, title: '약속2' },
    ]
  } catch (error) {
    console.error('⛔ 클럽 멤버 코드로 추가 실패:')
    return null
  }
}

// 클럽 멤버 이메일로 추가
interface AddMemberByEmailParams {
  clubId: number
  nextRange?: number
  prevRange?: number
}

export const addMemberByEmail = async ({
  clubId,
  nextRange = 4,
  prevRange = 4,
}: AddMemberByEmailParams) => {
  try {
    const response = await api.get(`/appointments`, {
      params: { clubId, nextRange, prevRange },
    })
    return [
      { id: 1, title: '약속1' },
      { id: 2, title: '약속2' },
    ]
  } catch (error) {
    console.error('⛔ 클럽 멤버 이메일로 추가 실패:')
    return null
  }
}

// 그룹 내 특정 멤버 조회
interface GetClubMemberParams {
  clubId: number
  clubMemberId: number
}

export const getClubMember = async ({
  clubId,
  clubMemberId,
}: GetClubMemberParams) => {
  try {
    const response = await api.get(`/clubs/${clubId}/members/${clubMemberId}`)
    return response
  } catch (error) {
    console.error('⛔ 그룹 내 특정 멤버 조회 실패:')
    return false
  }
}

// 멤버 정보 수정
interface UpdateClubMemberParams {
  clubId: number
  clubMemberId: number
  nickname: string
  clubName: string
}

export const updateClubMember = async ({
  clubId,
  clubMemberId,
  nickname,
  clubName,
}: UpdateClubMemberParams) => {
  try {
    const response = await api.patch(
      `/clubs/${clubId}/members/${clubMemberId}`,
      { params: { nickname, clubName } },
    )
    return response
  } catch (error) {
    console.error('⛔ 멤버 정보 수정 실패:')
    return false
  }
}

// 그룹 회원 탈퇴
interface DeleteClubMemberParams {
  clubId: number
  clubMemberId: number
}

export const deleteClubMember = async ({
  clubId,
  clubMemberId,
}: DeleteClubMemberParams) => {
  try {
    const response = await api.delete(
      `/clubs/${clubId}/members/${clubMemberId}`,
    )
    return response
  } catch (error) {
    console.error('⛔ 그룹 회원 탈퇴 실패:')
    return false
  }
}

interface BanMemberParams {
  clubId: number
  memberId: number
}

// 특정 회원 강퇴
export const banMember = async ({ clubId, memberId }: BanMemberParams) => {
  try {
    const response = await api.delete(`/clubs/${clubId}/members/ban`, {
      data: { memberId },
    })
    return response.data
  } catch (error) {
    console.error('⛔ 특정 회원 강퇴 실패:')
    return false
  }
}

// 이메일로 멤버 검색
export const searchMemberByEmail = async (email: string) => {
  try {
    const response = await api.post(`/clubs/search/email`, {
      email: 'test@email.com',
    })
    return response
  } catch (error) {
    console.error('⛔ 이메일로 멤버 검색 실패:')
    return null
  }
}

interface ExchangeAdminRoleParams {
  clubId: number
  newAdminId: number
}

export const exchangeAdminRole = async ({
  clubId,
  newAdminId,
}: ExchangeAdminRoleParams) => {
  try {
    const response = await api.patch(`/clubs/${clubId}/admin`, {
      data: { newAdminId },
    })
    return response.data
  } catch (error) {
    console.error('⛔ 관리자 권한 위임 실패:')
  }
}

// 클럽 대표 이미지 등록/수정
export const patchClubImg = async (
  clubId: number,
  fileName: string,
  binaryData: Blob,
) => {
  try {
    const response = await api.patch(`/clubs/${clubId}/clubImg`, {
      fileName,
    })
    const presignedUrl = response.data
    const result = await uploadBinaryToS3(binaryData, presignedUrl)
    return result.status === 200
  } catch (error) {
    console.error('⛔ 클럽 대표 이미지 등록/수정 실패')
    return null
  }
}
