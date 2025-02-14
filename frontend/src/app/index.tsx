import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, TouchableOpacity, View } from 'react-native'

import { getKeyHashAndroid } from '@react-native-kakao/core'
import { login } from '@react-native-kakao/user'
import { Link } from 'expo-router'

export default function TabOneScreen() {
  useEffect(() => {
    getKeyHashAndroid().then(console.log)
  })
  const { t } = useTranslation()
  return (
    <View className="flex-1 items-center justify-center">
      <Text>{t('index.title')}</Text>
      <Text>{t('index.catchphrase')}</Text>
      <Link href="/(tabs)/main">{t('index.lookArround')}</Link>
      <TouchableOpacity
        onPress={() => {
          login()
        }}>
        <Text>기도메타</Text>
      </TouchableOpacity>
    </View>
  )
}
