import api from "./api"

// 루틴 리스트 조회
export const getRoutines = async () => {
  // api가 status_data 구조가 아니라 BE 단에서 수정이 필요함
  try {
    const response = await api.get("/routines")
    console.log("response", response)
    return response
  } catch (error) {
    console.error("⛔ 루틴 리스트 조회 실패:")
    return null
  }
}

// 루틴 생성
// 특정 루틴 조회
// 특정 루틴 수정
// 특정 루틴 삭제
