import { beforeEach, describe, expect, it, jest, test } from '@jest/globals'

import { Club } from '../../../types/club'
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

function canLeaveClub(clubInfo: Club, loginMemberId: number) {
  const result = clubInfo.members.find(
    (member) => member.memberId === loginMemberId,
  )
  if (result?.createdBy === 0) {
    return false // 관리자일때는 그룹에서 탈퇴할 수 없다.
  }
  return true // 일반 유저일때는 그룹에서 탈퇴할 수 있다.
}
test('관리자일때는 그룹에서 탈퇴할 수 없다.', () => {
  const loginMemberInfo: Member = {
    id: 1,
    email: 'test@test.com',
    name: 'test',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    withdrawn: false,
  }

  const clubInfo: Club = {
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
        createdBy: 0,
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
  }
  console.log(
    'true면 탈퇴가능 false면 탈퇴 불가, 관리자 탈퇴 결과 : ',
    canLeaveClub(clubInfo, loginMemberInfo.id),
  )
  expect(canLeaveClub(clubInfo, loginMemberInfo.id)).toBe(false)
})

test('일반 유저는 그룹에서 탈퇴할 수 없다.', () => {
  const loginMemberInfo: Member = {
    id: 2,
    email: 'test@test.com',
    name: 'test2',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    withdrawn: false,
  }

  const clubInfo: Club = {
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
        createdBy: 0,
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
  }

  console.log(
    'true면 탈퇴가능 false면 탈퇴 불가, 일반 유저 탈퇴 결과 : ',
    canLeaveClub(clubInfo, loginMemberInfo.id),
  )
  expect(canLeaveClub(clubInfo, loginMemberInfo.id)).toBe(true)
})
