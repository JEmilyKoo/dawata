import api from './api'

// 내 정보 조회
export const getMyInfo = async () => {
  try {
    const response = await api.get(`/members`)
    return response.data
  } catch (error) {
    console.error('⛔ 네 정보 조회 실패:')
    return null
  }
}

export const getAttendanceStatus = async () => {
  try {
    const response = await api.get(`/members/appointment-info`)
    return response
  } catch (error) {
    console.error('⛔ 출석 상태 조회 실패:')
    return null
  }
}
interface GetUserAppointmentProps {
  date: string
}

export const getUserAppointment = async ({ date }: GetUserAppointmentProps) => {
  try {
    const response = await api.get(`/members/appointment-info/${date}`)
    return response
  } catch (error) {
    console.error('⛔ 이번 달 내 약속 조회 실패:')
    return null
  }
}
