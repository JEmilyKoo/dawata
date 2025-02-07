// /src/store/store.ts
import { configureStore } from '@reduxjs/toolkit'

import appointmentReducer from './slices/appointmentSlice'
import clubReducer from './slices/clubSlice'
import liveReducer from './slices/liveSlice'
import memberReducer from './slices/memberSlice'

export const store = configureStore({
  reducer: {
    appointment: appointmentReducer,
    club: clubReducer,
    member: memberReducer,
    live: liveReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
