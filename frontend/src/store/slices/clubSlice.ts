// /src/store/slices/appointmentSlice.ts
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import type { RootState } from '../store'

const initialState = {
  clubs: [
    {
      clubId: 1,
      name: '테스트 클럽',
      img: '',
      category: '',
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
    setAppointments(state, action) {
      const club = state.clubs.find(
        (club) => club.clubId === action.payload.clubId,
      )
      if (club) {
        club.appointment = action.payload.appointmentList
      }
    },
  },
})

// selector를 별도로 정의
export const selectAppointments = (state: RootState, clubId: number) =>
  state.club.clubs.find((club) => club.clubId === clubId)?.appointment ?? []

export const { setAppointments } = clubSlice.actions
export default clubSlice.reducer
