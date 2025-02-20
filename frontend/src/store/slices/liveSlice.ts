import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { AttendanceState, LiveData, WebSocketLiveResponse } from '@/types/live'

const initialState: {
  attendanceState: AttendanceState
  liveAppointmentId: number | null
  liveData: LiveData
  liveLat: number
  liveLog: number
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
  liveLat: 0,
  liveLog: 0,
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
    setLiveLat(state, action) {
      state.liveLat = action.payload
    },
    setLiveLog(state, action) {
      state.liveLog = action.payload
    },
    patchLiveData(state, action: PayloadAction<WebSocketLiveResponse[]>) {
      console.log('바뀌었나요? patchLiveData')
      const update = action.payload[0]

      if (!state.liveData || !state.liveData.participants) return

      const updatedParticipants = state.liveData.participants.map(
        (participant) =>
          participant.memberId === update.memberId
            ? {
                ...participant,
                latitude: update.latitude,
                longitude: update.longitude,
                arrivalState: update.arrivalState,
                estimatedTime: update.estimatedTime,
              }
            : participant,
      )

      state.liveData = {
        ...state.liveData,
        participants: updatedParticipants,
      }
      console.log('patchLiveData', state.liveData)
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
  setLiveLat,
  setLiveLog,
} = liveSlice.actions
export default liveSlice.reducer
