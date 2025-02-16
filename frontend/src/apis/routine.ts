import { Routine, RoutineCreate } from '@/types/routine'

import api from './api'

// 루틴 리스트 조회
export const getRoutines = async () => {
  // api가 status_data 구조가 아니라 BE 단에서 수정이 필요함
  try {
    const response = await api.get('/routines')
    console.log('response', response)
    return response.data
  } catch (error) {
    console.error('⛔ 루틴 리스트 조회 실패:')
    return null
  }
}

// 루틴 생성
export const createRoutine = async (routine: RoutineCreate) => {
  try {
    const response = await api.post('/routines', routine)
    return response
  } catch (error) {
    console.error('⛔ 루틴 생성 실패:')
    return null
  }
}

// 특정 루틴 삭제
export const removeRoutine = async (routineId: number) => {
  try {
    const response = await api.delete(`/routines/${routineId}`)
    return response
  } catch (error) {
    console.error('⛔ 루틴 삭제 실패:')
    return null
  }
}

// 특정 루틴 조회
export const getRoutine = async (routineId: number) => {
  try {
    const response = await api.get(`/routines/${routineId}`)
    return response.data
  } catch (error) {
    console.error('⛔ 루틴 조회 실패:')
    return null
  }
}

// 특정 루틴 수정
export const updateRoutine = async (
  routineId: number,
  routine: RoutineCreate,
) => {
  try {
    const response = await api.put(`/routines/${routineId}`, routine)
    return response
  } catch (error) {
    console.error('⛔ 루틴 수정 실패:')
    return null
  }
}
