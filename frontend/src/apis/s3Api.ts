import axios from 'axios'

import { handleDefaultError } from '@/utils/error/handleDefaultError'

export const s3Api = axios.create({
  timeout: 5000,
  headers: {
    'Content-Type': 'image/png', // 기본 바이너리 전송 형식
  },
})

s3Api.interceptors.request.use(
  (config) => {
    console.log('📤 요청 보냄:', config.url)
    return config
  },
  (error) => {
    console.error('🚨 요청 오류:', error)
    return Promise.reject(error)
  },
)

s3Api.interceptors.response.use(
  (response) => response,
  (error) => {
    return handleDefaultError(error)
  },
)

/**
 * 바이너리 데이터를 S3 Presigned URL로 업로드하는 함수
 * @param {ArrayBuffer} binaryData - 업로드할 이미지 바이너리 데이터
 * @param {string} url - 서명된 S3 URL
 */
export const uploadBinaryToS3 = async (binaryData: Blob, url: string) => {
  try {
    if (!url) throw new Error('URL이 없습니다.')
    const response = await s3Api.put(url, binaryData)
    return response
  } catch (error) {
    console.error('❌ 업로드 실패:', error)
    throw error
  }
}
