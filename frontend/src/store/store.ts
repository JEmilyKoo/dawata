// /src/store/store.ts
import { configureStore } from '@reduxjs/toolkit'

import appointmentReducer from './slices/appointmentSlice'
import clubReducer from './slices/clubSlice'
<<<<<<< HEAD
import memberReducer from './slices/memberSlice'
=======
import liveReducer from './slices/liveSlice'
>>>>>>> fcedd9eaa7ef291b462111c7fce95f1399fe3992

export const store = configureStore({
  reducer: {
    appointment: appointmentReducer,
    club: clubReducer,
<<<<<<< HEAD
    member: memberReducer,
=======
    live: liveReducer,
>>>>>>> fcedd9eaa7ef291b462111c7fce95f1399fe3992
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
