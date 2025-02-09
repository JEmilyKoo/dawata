// /src/store/slices/appointmentSlice.ts
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import type { RootState } from '../store'

const initialState = {
  create: {
    name: '',
    category: 'FRIEND',
  },
  clubs: [

    {
      id: 1,
      name: '테스트 클럽',
      img: '',
      category: 'FRIEND',
      teamCode: "H9UKRI",
      appointment: [
        {
          appointmentId: 1,
          name: '테스트 약속',
          category: 'STUDY',
        },
      ],
    },
  ],
}

const clubSlice = createSlice({
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
    setAppointments(state, action) {
      const club = state.clubs.find(
        (club) => club.id === action.payload.id,

      )
      if (club) {
        club.appointment = action.payload.appointmentList
      }
    },
    setClubs(state, action) {
      state.clubs = action.payload
    },
  },
})


// selector를 별도로 정의
export const selectAppointments = (state: RootState, clubId: number) =>
  state.club.clubs.find((club) => club.id === clubId)?.appointment ?? []

export const { resetCreate, setCreateName, setCreateCategory, setAppointments, setClubs} = clubSlice.actions
export default clubSlice.reducer
