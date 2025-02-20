import api from './api'

// 현재 나의 live 조회
export const findLives = async () => {
  try {
    const response = await api.get('/live')
    return response.data
  } catch (error) {
    console.error('⛔ 현재 나의 live 조회 실패:')
    return null
  }
}

// 특정 멤버에게 재촉알림 보내기
export const postUrgentNotification = async (
  appointmentId: number,
  targetParticipantId: number,
) => {
  try {
    const response = await api.post(`/live`, {
      appointmentId: 1,
      targetParticipantId: 1,
    })
    return response
  } catch (error) {
    console.error('⛔ 특정 멤버에게 재촉알림 보내기 실패:')
    return null
  }
}

// 현재 내 live 상세조회
export const findLiveDetail = async (appointmentId: number) => {
  try {
    const response = await api.get(`/live/${appointmentId}`)
    return response.data
  } catch (error) {
    console.error('⛔ 현재 내 live 상세조회 실패:')
    return null
  }
}

//화상 통화 토큰 발급
export const getLiveKitToken = async (appointmentId: number) => {
  try {
    const response = await api.get(`/live/${appointmentId}/token`)
    return response.data
  } catch (error) {
    console.error('⛔ 화상 통화 토큰 발급실패:')
    return null
  }
}

// 현재 실행중인 내 루틴 조회
export const findMyRoutineInLive = async () => {
  try {
    const response = await api.get('/live/routine')
    return response.data
  } catch (error) {
    console.error('⛔ 현재 나의 live 조회 실패:')
    return null
  }
}
