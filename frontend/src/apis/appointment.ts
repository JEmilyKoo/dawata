// 투표 방의 투표 항목 조회
// 투표 방의 투표 항목 생성
// 투표하기 (다중 투표 가능)
import axios from 'axios'

import store from '@/store/store'
import { RootState } from '@/store/store'
import { BooleanResponse } from '@/types/api'
import {
  AppointmentCreateInfo,
  AppointmentInfo,
  CreateVoteInfo,
} from '@/types/appointment'
import { handleDefaultError } from '@/utils/error/handleDefaultError'

import api from './api'

interface GetAppointmentsParams {
  clubId?: number
  nextRange?: number
  prevRange?: number
  date: string
}

interface UpdateMyAppointmentAttendanceParams {
  isAttending: boolean
}
interface UpdateAppointmentHostParams {
  clubId: number
  oriHost: {
    memberId: number
    participantId: number
  }
  newHost: {
    memberId: number
    participantId: number
  }
}

// 약속 리스트 조회
export const getAppointments = async ({
  clubId,
  nextRange = 99,
  prevRange = 99,
  date,
}: GetAppointmentsParams) => {
  try {
    const response = await api.get(`/appointments`, {
      params: { clubId, nextRange, prevRange, date },
    })
    return response.data
  } catch (error) {
    console.error('⛔ 약속 리스트 조회 실패:')
    return null
  }
}

// 약속 생성
export const createAppointment = async (
  appointmentCreateInfo: AppointmentCreateInfo,
): Promise<number> => {
  try {
    const { data } = (await api.post<BooleanResponse>(
      `/appointments`,
      appointmentCreateInfo,
    )) as unknown as BooleanResponse
    return data
  } catch (error) {
    console.error('⛔ 약속 생성 실패')
    return 0
  }
}

// 약속 상세 조회
export const getAppointmentDetail = async (appointmentId: number) => {
  try {
    const response = await api.get(`/appointments/${appointmentId}`)
    return response.data
  } catch (error) {
    console.error('⛔ 약속 상세 조회 실패:')
    return null
  }
}

// 약속 수정
export const updateAppointment = async (appointmentInfo: AppointmentInfo) => {
  try {
    console.log('dfkdjfldk', appointmentInfo)
    let { name, category, scheduledAt, voteEndTime } = appointmentInfo
    const response = await api.put(
      `/appointments/${appointmentInfo.appointmentId}`,
      { name, category, scheduledAt, voteEndTime },
    )
    return response
  } catch (error) {
    console.error('⛔ 약속 수정 실패:')
    return null
  }
}

// 약속 삭제
export const deleteAppointment = async (appointmentId: number) => {
  try {
    const response = await api.delete(`/appointments/${appointmentId}`)
    return response.data
  } catch (error) {
    console.error('⛔ 약속 삭제 실패:')
    return null
  }
}

// 내 약속 참여 상태 변경
export const updateMyAppointmentAttendance = async (
  appointmentId: number,
  params: UpdateMyAppointmentAttendanceParams,
) => {
  try {
    const response = await api.patch(
      `/appointments/${appointmentId}/participants/attending`,
      params,
    )
    return response.data
  } catch (error) {
    console.error('⛔ 내 약속 참여 상태 변경 실패:')
    return null
  }
}

// 약속 모임장 업데이트
export const updateAppointmentHost = async (
  appointmentId: number,
  params: UpdateAppointmentHostParams,
) => {
  try {
    const response = await api.patch(
      `/appointments/${appointmentId}/host`,
      params,
    )
    return response.data
  } catch (error) {
    console.error('⛔ 약속 모임장 업데이트 실패:')
    return null
  }
}

const placeApi = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL,
  timeout: 1000000,
  headers: {
    'Content-Type': 'application/json',
  },
})

placeApi.interceptors.request.use(
  (config) => {
    const state: RootState = store.getState()
    const accessToken = state.auth.socialLogin.accessToken

    if (accessToken) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${accessToken}`
    } else {
      delete config.headers.accessToken
    }

    return config
  },
  (error) => {
    console.error('🚨 요청 오류:', error)
    return Promise.reject(error)
  },
)

placeApi.interceptors.response.use(
  (response) => {
    console.log('🌐 인터셉터 응답:', response)
    return response.data // 반드시 response.data만 반환
  },
  (error) => {
    console.error('🚨 API 응답 오류:', error.response || error)
    return Promise.reject(error)
  },
)

// 장소 추천 받기
export const recommendPlace = async (appointmentId: number) => {
  try {
    console.log('Tlqkfsusemfdl', appointmentId)
    const response = await placeApi.get(`/appointments/${appointmentId}/place`)
    console.log('res', response)
    return response
  } catch (error) {
    console.error('⛔ 장소 추천 받기 실패:')
    return null
  }
}

// createVoteItem
export const createVoteItem = async ({
  createVoteInfo,
  appointmentId,
}: {
  createVoteInfo: CreateVoteInfo
  appointmentId: number
}) => {
  try {
    const data = await api.post(
      `/appointments/${appointmentId}/vote-items`,
      createVoteInfo,
    )
    return data
  } catch (error) {
    console.error('⛔ 투표 항목 생성 실패')
    return 0
  }
}
