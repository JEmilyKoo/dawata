import api from './api'

// 내 모든 알림 조회
interface NoticeParams {
  noticeId: number
}

export const getNotices = async () => {
  try {
    const response = await api.get('/notices')
    return response
  } catch (error) {
    console.error('⛔ 내 모든 알림 조회 실패:')
    return false
  }
}

// 알림 읽기
export const updateNoticeRead = async ({ noticeId }: NoticeParams) => {
  try {
    const response = await api.post(`/notices/${noticeId}`)
    return response
  } catch (error) {
    console.error('⛔ 알림 읽기 실패:')
    return false
  }
}

// 알림 삭제
export const deleteNotice = async ({ noticeId }: NoticeParams) => {
  try {
    const response = await api.delete(`/notice/${noticeId}`)
    return response
  } catch (error) {
    console.error('⛔ 알림 삭제 실패:')
    return false
  }
}
