// /src/store/store.ts
import { configureStore } from '@reduxjs/toolkit'

import addressReducer from './slices/addressSlice'
import appointmentReducer from './slices/appointmentSlice'
import clubReducer from './slices/clubSlice'
import errorModalReducer from './slices/errorModalSlice'
import liveReducer from './slices/liveSlice'
import memberReducer from './slices/memberSlice'
import routineReducer from './slices/routineSlice'

export const store = configureStore({
  reducer: {
    appointment: appointmentReducer,
    club: clubReducer,
    member: memberReducer,
    live: liveReducer,
    errorModal: errorModalReducer,
    address: addressReducer,
    routine: routineReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
