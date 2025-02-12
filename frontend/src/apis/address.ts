// 회원 주소 조회
import api from './api'

export const getAddresses = async () => {
  try {
    const response = await api.get(`/addresses`)
    return response.data
  } catch (error) {
    console.error('⛔ 전체 주소 조회 실패:')
    return null
  }
}

// 회원 주소 상세조회
// 회원 주소 변경
// 회원 주소 삭제
