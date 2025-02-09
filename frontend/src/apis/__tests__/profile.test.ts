import { afterEach, describe, expect, jest, test } from '@jest/globals'

import { AttendanceStatus } from '@/types/profile'
import handleApiError from '@/utils/errorHandler'

import api from '../api'
import { getAttendanceStatus } from '../profile'

// api 모듈 전체를 mock
jest.mock('../api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}))

// export const getClub = async ({ clubId }: GetClubParams) => {
//     try {
//       const response = await api.get(`/clubs/${clubId}`)
//       console.log("결과가 나옴에 의의를 둠" + response)
//       return [
//         { id: 1, title: "약속1" },
//         { id: 2, title: "약속2" },
//       ]
//     } catch (error) {
//       console.error("⛔ 특정 그룹 데이터 조회 실패:", handleApiError(error))
//       return null
//     }
//   }

test('getAttendanceStatus - 출석 상태 조회 요청 성공', async () => {
  const mockResponse: AttendanceStatus[] = [
    {
      clubId: 1,
      clubName: 'No.1',
      totalCount: 20,
      appointmentTotalCount: 15,
      lateTotalCount: 2,
      onTimeAttendanceTotalCount: 3,
    },
    {
      clubId: 2,
      clubName: '학술모임',
      totalCount: 10,
      appointmentTotalCount: 8,
      lateTotalCount: 1,
      onTimeAttendanceTotalCount: 1,
    },
  ]

  ;(
    api.get as jest.Mock<Promise<{ data: AttendanceStatus[] }>, []>
  ).mockResolvedValue({ data: mockResponse })

  const result = await getAttendanceStatus()
  expect(api.get).toHaveBeenCalledWith(`/members/appointment-info`)
  expect(result).toEqual({ data: mockResponse })
})
