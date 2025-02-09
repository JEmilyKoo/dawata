// /src/store/slices/appointmentSlice.ts
import { createSlice } from '@reduxjs/toolkit'

import { AppointmentCreateInfo } from '@/types/appointment'

const initialState: { create: AppointmentCreateInfo } = {
  create: {
    name: '',
    category: '',
    scheduledAt: '',
    voteEndTime: '',
    clubId: 1,
    memberIds: [],
  },
}

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    initCreate(state, action) {
      state.create = initialState.create
      setCreateClubId(action)
    },
    setCreateName(state, action) {
      state.create.name = action.payload
    },

    setCreateCategory(state, action) {
      state.create.category = action.payload
    },
    setCreateScheduledAt(state, action) {
      state.create.scheduledAt = action.payload
    },
    setCreateVoteEndTime(state, action) {
      state.create.voteEndTime = action.payload
    },
    setCreateClubId(state, action) {
      state.create.clubId = action.payload
    },
    setCreateMemberIds(state, action) {
      state.create.memberIds = action.payload
    },
  },
})

export const {
  initCreate,
  setCreateName,
  setCreateCategory,
  setCreateScheduledAt,
  setCreateVoteEndTime,
  setCreateClubId,
  setCreateMemberIds,

} = appointmentSlice.actions
export default appointmentSlice.reducer
