import { BooleanResponse } from '@/types/api'
import { AppointmentCreateInfo } from '@/types/appointment'

import api from './api'

interface GetAppointmentsParams {
  clubId: number
  nextRange?: number
  prevRange?: number
}
interface UpdateMyAppointmentAttendanceParams {
  isAttending: boolean
}

// 약속 리스트 조회
export const getAppointments = async ({
  clubId,
  nextRange = 4,
  prevRange = 4,
}: GetAppointmentsParams) => {
  try {
    const response = await api.get(`/appointments`, {
      params: { clubId, nextRange, prevRange },
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
): Promise<boolean> => {
  try {
    const { status } = (await api.post<BooleanResponse>(
      `/appointments`,
      appointmentCreateInfo,
    )) as unknown as BooleanResponse
    return status === 'success'
  } catch (error) {
    console.error('⛔ 약속 생성 실패')
    return false
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

// 투표 방의 투표 항목 조회

// 투표 방의 투표 항목 생성
// 투표하기 (다중 투표 가능)
