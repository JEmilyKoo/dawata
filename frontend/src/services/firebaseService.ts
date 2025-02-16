import messaging from '@react-native-firebase/messaging'
import Constants from 'expo-constants'
import { getApp, initializeApp } from 'firebase/app'

import { insertFCMToken } from '@/apis/auth'

export const initFCM = async () => {
  const firebaseConfig = Constants.expoConfig?.extra?.firebase

  let firebaseApp
  try {
    firebaseApp = getApp()
  } catch (error) {
    firebaseApp = initializeApp(firebaseConfig)
  }

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('백그라운드 상태에서 메시지 수신:', remoteMessage)
  })
}

const fetchFCMToken = async () => {
  try {
    const authStatus = await messaging().requestPermission()
    if (authStatus !== 1) {
      return null
    }
  } catch (error) {
    console.error('Permission denied:', error)
    return
  }

  return await messaging().getToken()
}

export const getFcmToken = async () => {
  try {
    const token = await fetchFCMToken()
    if (token) {
      await insertFCMToken({ token })
    }
    return token
  } catch (error) {
    throw error
  }
}
