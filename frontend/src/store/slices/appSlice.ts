import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface AuthState {
  isInitialized: boolean
}

const initialState: AuthState = {
  isInitialized: false,
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setIsInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload
    },
  },
})

export const { setIsInitialized } = appSlice.actions
export default appSlice.reducer
