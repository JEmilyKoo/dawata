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
