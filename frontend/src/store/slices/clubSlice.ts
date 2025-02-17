// /src/store/slices/appointmentSlice.ts
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { Club } from '@/types/club'

import type { RootState } from '../store'

interface ClubSliceInitialState {
  create: {
    name: string
    category: string
  }
  clubs: Club[]
}
const initialState: ClubSliceInitialState = {
  create: {
    name: '',
    category: 'FRIEND',
  },
  clubs: [],
}

const clubSlice = createSlice({
  name: 'club',
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
    setClubs(state, action) {
      state.clubs = action.payload
    },
  },
})

// selector를 별도로 정의
// export const selectAppointments = (state: RootState, clubId: number) =>
//   state.club.clubs.find((club) => club.clubId === clubId)?.appointment ?? []

export const { resetCreate, setCreateName, setCreateCategory, setClubs } =
  clubSlice.actions
export default clubSlice.reducer
