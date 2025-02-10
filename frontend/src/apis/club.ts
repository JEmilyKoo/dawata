import { Club } from '@/types/club'
import type { ClubCreateInfo } from '@/types/club'

import api from './api'

//그룹 생성

export const createClub = async (params: ClubCreateInfo) => {
  try {
    const response = await api.post('/clubs', params)
    return response.data
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

export const getClub = async ({ clubId }: GetClubParams) => {
  try {
    const response = await api.get(`/clubs/${clubId}`)
    console.log('결과가 나옴에 의의를 둠' + response)
    return [
      { id: 1, title: '약속1' },
      { id: 2, title: '약속2' },
    ]
  } catch (error) {
    console.error('⛔ 특정 그룹 데이터 조회 실패:')
    return null
  }
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
    console.log('결과가 나옴에 의의를 둠' + response)
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
    console.log('결과가 나옴에 의의를 둠' + response)
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
  adminId: number
  memberId: number
}

// 특정 회원 강퇴
export const banMember = async ({
  clubId,
  adminId,
  memberId,
}: BanMemberParams) => {
  try {
    const response = await api.delete(`/clubs/${clubId}/members/ban`, {
      params: { adminId, memberId },
    })
    return response
  } catch (error) {
    console.error('⛔ 특정 회원 강퇴 실패:')
    return false
  }
}
