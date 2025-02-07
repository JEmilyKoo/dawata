import { beforeEach, describe, expect, it, jest, test } from '@jest/globals'
import { configureStore } from '@reduxjs/toolkit'
import axios from 'axios'

import api from '../../../apis/api'
import { getClubMembers } from '../../../apis/club'
import memberReducer, { setMemberData } from '../../../store/slices/memberSlice'
import { Club, ClubMember } from '../../../types/club'
import { Member } from '../../../types/member'

jest.mock('../../../apis/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
  },
}))

// 클럽 멤버인지 확인해야한다.

// test('로그인한 유저의 정보를 memberSlice에 저장한다.', () => {
//   const member = {
//     id: 1,
//     email: 'test@test.com',
//     name: 'test',
//     withdrawn: false,
//     createdAt: '2024-01-01',
//     updatedAt: '2024-01-01',
//   }
//   const store = configureStore({
//     reducer: {
//       member: memberReducer,
//     },
//   })

//   store.dispatch(setMemberData(member))
// })

// 2. clubId/member 조회

//     response data ({
//         "id": 0, // 클럽 멤버 아이디 정확히 user 고유 pk id 가 아니라, 클럽 안에서의 id
//         "memberId": 0, // 유저 아이디
//         "clubId": 0, // 클럽 아이디
//         "nickname": "string", // 유저 닉네임
//         "clubName": "string", // 클럽 이름
//         "createdBy": 0 // 클럽 생성자 아이디
//       })
//       Response.data.memberId === user_id 인지 확인인

test('로그인한 유저의 id가 getClubMembers로 받은 데이터에 존재하는지 확인해야한다.', async () => {
  const loginMemberInfo: Member = {
    id: 1,
    email: 'test@test.com',
    name: 'test',
    withdrawn: false,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  }

  const clubList: Club[] = [
    {
      id: 1,
      name: 'No.1',
      category: 'study',
      teamCode: 'testTeamCode',
      members: [
        {
          id: 1,
          memberId: 1,
          clubId: 1,
          nickname: 'testNickname',
          clubName: 'testClubName',
          createdBy: 1,
        },
        {
          id: 2,
          memberId: 2,
          clubId: 1,
          nickname: 'testNickname2',
          clubName: 'testClubName2',
          createdBy: 1,
        },
      ],
    },
  ]
  const mockApi = api as jest.Mocked<typeof api>
  mockApi.get.mockResolvedValue({ data: clubList })

  const result = await getClubMembers({ clubId: 1 })
  expect(result).not.toBeNull()
  if (result) {
    const clubMember: ClubMember[] = result.data[0].members
    const isExist = clubMember.some(
      (member) => member.memberId === loginMemberInfo.id,
    )
    expect(isExist).toBe(true)
  }
})
