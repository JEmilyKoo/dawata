import api from './api'

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
