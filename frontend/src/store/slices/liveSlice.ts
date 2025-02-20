import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { AttendanceState, LiveData, WebSocketLiveResponse } from '@/types/live'

const initialState: {
  attendanceState: AttendanceState
  liveAppointmentId: number | null
  liveData: LiveData
} = {
  attendanceState: {
    showArrived: true,
    showNotArrived: true,
    showAbsent: true,
  },
  liveAppointmentId: null as number | null,
  liveData: {
    latitude: 0,
    longitude: 0,
    appointmentTime: '',
    participants: [],
  },
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
    setLiveAppointmentId(state, action) {
      state.liveAppointmentId = action.payload
    },
    resetLiveData(state) {
      state.liveAppointmentId = initialState.liveAppointmentId
      state.liveData = initialState.liveData
    },
    setLiveData(state, action) {
      state.liveData = action.payload
    },
    patchLiveData(state, action: PayloadAction<WebSocketLiveResponse[]>) {
      action.payload.forEach((update) => {
        const participant = state.liveData.participants.find(
          (p) => p.memberId === update.memberId,
        )
        if (participant) {
          participant.latitude = update.latitude
          participant.longitude = update.longitude
          participant.arrivalState = update.arrivalState
          participant.expectedArrivalTime = update.estimatedTime
        }
      })
    },
  },
})
export const {
  toggleShowArrived,
  toggleShowNotArrived,
  toggleShowAbsent,
  setLiveAppointmentId,
  resetLiveData,
  setLiveData,
  patchLiveData,
} = liveSlice.actions
export default liveSlice.reducer
