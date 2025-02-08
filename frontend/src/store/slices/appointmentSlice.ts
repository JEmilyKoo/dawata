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
    resetCreate(state) {
      state.create = initialState.create
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
  resetCreate,
  setCreateName,
  setCreateCategory,
  setCreateScheduledAt,
  setCreateVoteEndTime,
  setCreateClubId,
  setCreateMemberIds,

} = appointmentSlice.actions
export default appointmentSlice.reducer
