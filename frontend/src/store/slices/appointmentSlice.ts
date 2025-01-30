// /src/store/slices/appointmentSlice.ts
import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  promiseName: "",
  category: "",
  dateTime: {},
  participants: [],
}

const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    setPromiseName(state, action) {
      state.promiseName = action.payload
    },
    setCategory(state, action) {
      state.category = action.payload
    },
    setDateTime(state, action) {
      state.dateTime = action.payload
    },
    setParticipants(state, action) {
      state.participants = action.payload
    },
  },
})

export const { setPromiseName, setCategory, setDateTime, setParticipants } =
  appointmentSlice.actions
export default appointmentSlice.reducer
