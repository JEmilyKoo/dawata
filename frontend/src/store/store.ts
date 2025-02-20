import AsyncStorage from '@react-native-async-storage/async-storage'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'

import addressReducer from './slices/addressSlice'
import appReducer from './slices/appSlice'
import appointmentReducer from './slices/appointmentSlice'
import authReducer from './slices/authSlice'
import clubReducer from './slices/clubSlice'
import errorModalReducer from './slices/errorModalSlice'
import liveReducer from './slices/liveSlice'
import memberReducer from './slices/memberSlice'
import routineReducer from './slices/routineSlice'

export const RESET_STORE = 'RESET_STORE'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['app'],
}

const rootReducer = combineReducers({
  appointment: appointmentReducer,
  club: clubReducer,
  member: memberReducer,
  live: liveReducer,
  errorModal: errorModalReducer,
  address: addressReducer,
  routine: routineReducer,
  auth: authReducer,
  app: appReducer,
})

const reducer = (state: any, action: any) => {
  if (action.type === RESET_STORE) {
    AsyncStorage.clear()
    state = undefined
  }
  return rootReducer(state, action)
}

export const store = configureStore({
  reducer: persistReducer(persistConfig, reducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
})

export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const resetStore = () => ({ type: RESET_STORE })

export default store
