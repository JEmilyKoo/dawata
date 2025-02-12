import api from './api'
import { uploadBinaryToS3 } from './s3Api'

// 회원 정보 조회
// 회원 약속, 그룹의 취합 데이터 조회
// 회원 정보 수정
// 회원 탈퇴// 회원 이미지 수정

// 프로필 이미지 등록/수정
export const patchMemberImg = async (fileName: string, binaryData: Blob) => {
  try {
    const response = await api.put(`/members/photo`, {
      fileName,
    })
    const presignedUrl = response.data
    const result = await uploadBinaryToS3(binaryData, presignedUrl)
    return result.status === 200
  } catch (error) {
    console.error('⛔ 클럽 대표 이미지 등록/수정 실패')
    return null
  }
}
