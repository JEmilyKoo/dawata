// 회원 주소 조회
import AddressCreate from '@/types/address'

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

export const createAddress = async (params: AddressCreate) => {
  try {
    const response = await api.post('/addresses', params)
    return response.data
  } catch (error) {
    return null
  }
}

// 회원 주소 상세조회
// 회원 주소 변경
// 회원 주소 삭제
