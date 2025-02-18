// /src/store/slices/appointmentSlice.ts
import { createSlice } from '@reduxjs/toolkit'

import {
  AppointmentCreateInfo,
  AppointmentInfo,
  CreateVoteInfo,
  LocationData,
  Standard,
} from '@/types/appointment'

const initialState: {
  createAppointmentId: number
  create: AppointmentCreateInfo
  update: AppointmentInfo
  currentVoteStatus: string
  recommandedPlace: LocationData | null
  createVoteItemList: CreateVoteInfo[]
  standardList: Standard[]
} = {
  createAppointmentId: 0,
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
  recommandedPlace: null,
  createVoteItemList: [],
  standardList: [],
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
      Object.assign(state.update, initialState.update)
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

    setRecommandedPlace(state, action) {
      state.recommandedPlace = action.payload
    },
    setCreateVoteItemList(state, action) {
      state.createVoteItemList = action.payload
    },
    setStandardList(state, action) {
      state.standardList = action.payload
    },
    addStandardList(state, action) {
      state.standardList = [...state.standardList, ...action.payload]
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
  setRecommandedPlace,
  setCreateVoteItemList,
  setStandardList,
} = appointmentSlice.actions
export default appointmentSlice.reducer
