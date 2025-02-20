import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { SocialLogin } from '@/types/auth'

interface AuthState {
  socialLogin: SocialLogin
  FCMToken: string | null
}

const initialState: AuthState = {
  socialLogin: {
    accessToken: null,
    expiresIn: null,
    refreshToken: null,
  },
  FCMToken: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoginTokens: (state, action: PayloadAction<SocialLogin>) => {
      state.socialLogin = action.payload
    },
    setFCMToken: (state, action: PayloadAction<string>) => {
      state.FCMToken = action.payload
    },
    clearTokens: (state) => {
      Object.assign(state, initialState)
    },
  },
})

export const { setLoginTokens, setFCMToken, clearTokens } = authSlice.actions
export default authSlice.reducer
