import { createSlice } from '@reduxjs/toolkit'

import { Member } from '../../types/member'

const initialState = {
  user: {
    id: 1,
    email: 'test@email.com',
    name: '구정은',
    img: 'profile1.png',
    createdAt: '2025-02-07T01:35:58',
  },
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
    setUser(state, action) {
      state.user = {
        ...state.user,
        ...action.payload,
      }
    },
  },
})

// 각 액션을 exports
export const { addMember, updateMember, setMemberData } = memberSlice.actions

export default memberSlice.reducer
