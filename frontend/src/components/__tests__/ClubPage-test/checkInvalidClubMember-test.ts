import { beforeEach, describe, expect, it, jest, test } from '@jest/globals'
import { configureStore } from '@reduxjs/toolkit'

import memberReducer, { setMemberData } from '../../../store/slices/memberSlice'

// 클럽 멤버인지 확인해야한다.

test('로그인한 유저의 정보를 memberSlice에 저장한다.', () => {
  const member = {
    id: 1,
    email: 'test@test.com',
    name: 'test',
    withdrawn: false,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  }
  const store = configureStore({
    reducer: {
      member: memberReducer,
    },
  })

  store.dispatch(setMemberData(member))
})

// 2. clubId/member 조회

//     response data ({
//         "id": 0, // 클럽 멤버 아이디 정확이 user 고유 pk id 가 아니라, 클럽 안에서의 id
//         "memberId": 0, // 유저 아이디
//         "clubId": 0, // 클럽 아이디
//         "nickname": "string", // 유저 닉네임
//         "clubName": "string", // 클럽 이름
//         "createdBy": 0 // 클럽 생성자 아이디
//       })
//       Response.data.memberId === user_id 인지 확인인
