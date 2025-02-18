import { useCallback, useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Image, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { MenuProvider } from 'react-native-popup-menu'
import 'react-native-reanimated'
import 'react-native-reanimated'
import { Provider, useDispatch, useSelector } from 'react-redux'

import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { usePathname, useRouter } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import 'global.css'
import { PersistGate } from 'redux-persist/integration/react'

import ErrorModal from '@/components/ErrorModal'
import { getFcmToken } from '@/services/firebaseService'
import { setFCMToken } from '@/store/slices/authSlice'
import { RootState } from '@/store/store'
import { FontProvider } from '@/utils/FontContext'

import '../../global.css'
import i18n from '../../i18n'
import store, { persistor } from '../store/store'

export { ErrorBoundary } from 'expo-router'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    NotoSansKR: require('@/assets/fonts/NotoSansKR-Regular.ttf'),
  })

  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync()
  }, [loaded])

  if (!loaded)
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Image
          source={require('@/assets/images/splash-icon.gif')}
          resizeMode="contain"
          style={{ width: '100%', maxHeight: 100 }}
        />
      </View>
    )

  return (
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}>
        <RootLayoutNav />
      </PersistGate>
    </Provider>
  )
}

function RootLayoutNav() {
  const dispatch = useDispatch()
  const router = useRouter()
  const pathname = usePathname()
  const { isInitialized } = useSelector((state: RootState) => state.app)
  const { socialLogin, FCMToken } = useSelector(
    (state: RootState) => state.auth,
  )

  useEffect(() => {
    if (
      isInitialized &&
      socialLogin.accessToken &&
      pathname !== '/(tabs)/main'
    ) {
      router.replace('/(tabs)/main')
    }
  }, [socialLogin.accessToken, isInitialized])

  const fetchFcmToken = useCallback(async () => {
    if (!isInitialized || FCMToken) return
    try {
      const result = await getFcmToken()
      if (result) dispatch(setFCMToken(result))
    } catch (error) {
      console.error('🚨 FCM 토큰 가져오기 실패:', error)
    }
  }, [FCMToken, isInitialized])

  useEffect(() => {
    fetchFcmToken()
  }, [fetchFcmToken])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FontProvider>
        <MenuProvider>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <ErrorModal />
              <Stack
                screenOptions={{ headerShown: false, statusBarStyle: 'dark' }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen
                  name="club"
                  options={{
                    headerShown: false,
                    headerShadowVisible: false,
                  }}
                />
              </Stack>
            </I18nextProvider>
          </Provider>
        </MenuProvider>
      </FontProvider>
    </GestureHandlerRootView>
  )
}
