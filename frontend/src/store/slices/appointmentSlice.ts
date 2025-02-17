// /src/store/slices/appointmentSlice.ts
import { createSlice } from '@reduxjs/toolkit'

import {
  AppointmentCreateInfo,
  AppointmentInfo,
} from '@/types/appointment'

const initialState: {
  create: AppointmentCreateInfo
  update: AppointmentInfo
  currentVoteStatus: string
} = {
  create: {
    name: '',
    category: '',
    scheduledAt: '',
    voteEndTime: '',
    clubId: 1,
    memberIds: [],
  },
  update: {
    name: '',
    category: '',
    scheduledAt: '',
    voteEndTime: '',
    appointmentId: 0,
  },

  currentVoteStatus: '',
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

    initUpdate(state) {
      state.update = initialState.update
    },
    patchUpdate(state, action) {
      state.update.name = action.payload.name
      state.update.appointmentId = action.payload.appointmentId
      state.update.category = action.payload.category
      state.update.scheduledAt = action.payload.scheduledAt
      state.update.voteEndTime = action.payload.voteEndTime
    },
    setUpdateName(state, action) {
      state.update.name = action.payload
    },
    setUpdateCategory(state, action) {
      state.update.category = action.payload
    },
    setUpdateScheduledAt(state, action) {
      state.update.scheduledAt = action.payload
    },
    setUpdateVoteEndTime(state, action) {
      state.update.voteEndTime = action.payload
    },
    setUpdateAppointmentId(state, action) {
      state.update.appointmentId = action.payload
    },
    setCurrentVoteStatus(state, action) {
      state.currentVoteStatus = action.payload
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
  setCurrentVoteStatus,
  setUpdateAppointmentId,
  setUpdateVoteEndTime,
  setUpdateScheduledAt,
  setUpdateCategory,
  setUpdateName,
  patchUpdate,
  initUpdate,
} = appointmentSlice.actions
export default appointmentSlice.reducer
