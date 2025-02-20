import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Image,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import changeNavigationBarColor from 'react-native-navigation-bar-color'
import { useDispatch, useSelector } from 'react-redux'

import { Link } from 'expo-router'

import { initFCM } from '@/services/firebaseService'
import { initKakao, kakaoToSocialLogin } from '@/services/kakaoService'
import { setIsInitialized } from '@/store/slices/appSlice'
import { setLoginTokens } from '@/store/slices/authSlice'
import { RootState } from '@/store/store'

export default function Index() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const isInitialized = useSelector(
    (state: RootState) => state.app.isInitialized,
  )
  useEffect(() => {
    if (!isInitialized && Platform.OS !== 'web') {
      initFCM().catch(console.error)
      initKakao()
      dispatch(setIsInitialized(true))
    }

    changeNavigationBarColor('white', true)
  }, [isInitialized, dispatch])

  const loginStart = async () => {
    const result = await kakaoToSocialLogin()
    if (result) {
      dispatch(setLoginTokens(result))
    }
  }

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <View className="w-3/4 h-1/2 justify-between">
        <Text>{t('index.catchphrase')}</Text>
        <View className="mb-4">
          <Image
            source={require('@/assets/images/logo.png')}
            resizeMode="contain"
            style={{ width: '100%', maxHeight: 100 }}
          />
        </View>
        <View>
          <TouchableOpacity
            onPress={loginStart}
            className="justify-center items-center">
            <Image
              source={require('@/assets/images/kakao_login_medium_wide.png')}
            />
          </TouchableOpacity>
          <View className="w-full items-end text-primary">
            <Link
              href="/(tabs)/main"
              className="text-text-primary">
              {t('index.lookArround')}
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
