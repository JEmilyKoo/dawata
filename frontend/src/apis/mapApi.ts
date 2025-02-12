import axios from 'axios'

import {
  Coord,
  SearchByCategoryProps,
  SearchByKeywordProps,
} from '@/types/address'
import { handleDefaultError } from '@/utils/error/handleDefaultError'

export const kakaoApi = axios.create({
  baseURL: process.env.EXPO_PUBLIC_KAKAO_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `KakaoAK ${process.env.EXPO_PUBLIC_KAKAO_MAP_REST_API_KEY}`,
  },
})

kakaoApi.interceptors.request.use(
  (config) => {
    console.log('📤 요청 보냄:', config.url)
    return config
  },
  (error) => {
    console.error('🚨 요청 오류:', error)
    return Promise.reject(error)
  },
)

kakaoApi.interceptors.response.use(
  (response) => response,
  (error) => {
    return handleDefaultError(error)
  },
)

export const getAddressCoord = async (query: string) => {
  try {
    const response = await kakaoApi.get(`/local/search/address.json`, {
      params: {
        query,
      },
    })
    return response
  } catch (error) {
    console.log(error)
    return null
  }
}

export const getCoordToAddress = async (coord: Coord) => {
  try {
    const response = await kakaoApi.get(`/local/geo/coord2address`, {
      params: {
        x: coord.x,
        y: coord.y,
      },
    })
    return response
  } catch (error) {
    console.log(error)
    return null
  }
}

export const searchByKeyword = async (props: SearchByKeywordProps) => {
  try {
    const response = await kakaoApi.get(`/local/search/keyword.json`, {
      params: props,
    })
    return response
  } catch (error) {
    console.log(error)
    return []
  }
}

export const searchByCategory = async (props: SearchByCategoryProps) => {
  try {
    const response = await kakaoApi.get(`/local/search/category.json`, {
      params: props,
    })
    return response
  } catch (error) {
    console.log(error)
    return []
  }
}
