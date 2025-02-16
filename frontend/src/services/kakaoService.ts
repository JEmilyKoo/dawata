import { initializeKakaoSDK } from '@react-native-kakao/core'
import { login } from '@react-native-kakao/user'
import Constants from 'expo-constants'

import { socialLogin } from '@/apis/auth'

export const initKakao = () => {
  const kakaoApiKey = Constants.expoConfig?.extra?.kakaoApiKey
  initializeKakaoSDK(kakaoApiKey)
}

export const kakaoToSocialLogin = async () => {
  try {
    const result = await login()
    if (result.accessToken) {
      return await socialLogin({
        accessToken: result.accessToken,
      })
    }
    return null
  } catch (error) {
    console.log('로그인 에러:', error)
  }
}
