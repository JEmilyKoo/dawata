import { createSlice } from '@reduxjs/toolkit'

import { AttendanceState } from '@/types/live'

const initialState = {
  attendanceState: {
    showArrived: true,
    showNotArrived: true,
    showAbsent: true,
  } as AttendanceState,
}

const liveSlice = createSlice({
  name: 'live',
  initialState,
  reducers: {
    toggleShowArrived(state) {
      state.attendanceState.showArrived = !state.attendanceState.showArrived
    },
    toggleShowNotArrived(state) {
      state.attendanceState.showNotArrived =
        !state.attendanceState.showNotArrived
    },

    toggleShowAbsent(state) {
      state.attendanceState.showAbsent = !state.attendanceState.showAbsent
    },
  },
})

export const { toggleShowArrived, toggleShowNotArrived, toggleShowAbsent } =
  liveSlice.actions
export default liveSlice.reducer
