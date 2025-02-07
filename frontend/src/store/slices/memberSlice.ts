import { createSlice } from '@reduxjs/toolkit'

import { Member } from '../../types/member'

// 기존의 Member 인터페이스를 사용하여 초기 상태 설정

// const initialState: Member = {
//   createdAt: '',
//   updatedAt: '',
//   id: 0,
//   email: '',
//   name: '',
//   withdrawn: false,
// }

const initialState = {
  members: [
    {
      createdAt: '',
      updatedAt: '',
      id: 0,
      email: '',
      name: '',
      withdrawn: false,
    },
  ],
}

const memberSlice = createSlice({
  name: 'member',
  initialState,
  reducers: {
    addMember(state, action) {
      state.members.push(action.payload)
    },
    updateMember(state, action) {
      const { id, ...updates } = action.payload
      const memberIndex = state.members.findIndex((member) => member.id === id)
      if (memberIndex !== -1) {
        state.members[memberIndex] = {
          ...state.members[memberIndex],
          ...updates,
        }
      }
    },
    setMemberData(state, action) {
      const memberIndex = state.members.findIndex(
        (member) => member.id === action.payload.id,
      )
      if (memberIndex !== -1) {
        state.members[memberIndex] = {
          ...state.members[memberIndex],
          ...action.payload,
        }
      } else {
        state.members.push(action.payload)
      }
    },
  },
})

// 각 액션을 exports
export const { addMember, updateMember, setMemberData } = memberSlice.actions

export default memberSlice.reducer
