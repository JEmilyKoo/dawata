// /src/store/store.ts
import { configureStore } from "@reduxjs/toolkit"

import appointmentReducer from "./slices/appointmentSlice"
import clubReducer from "./slices/clubSlice"

export const store = configureStore({
  reducer: {
    appointment: appointmentReducer,
    club: clubReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
