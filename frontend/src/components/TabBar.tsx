import { useTranslation } from 'react-i18next'
import { Image, Pressable, Text, View } from 'react-native'

import { usePathname, useRouter } from 'expo-router'

import AppointmentIcon from '@/assets/icons/appointment.svg'
import MainIcon from '@/assets/icons/main.svg'
import NoticeIcon from '@/assets/icons/notice.svg'
import ProfileIcon from '@/assets/icons/profile.svg'
import colors from '@/constants/Colors'

import TabBarIcon from './TabBarIcon'

export default function TabBar() {
  const { t } = useTranslation()
  const router = useRouter()
  const pathname = usePathname()

  const tabs = [
    {
      name: 'main',
      icon: MainIcon,
    },
    {
      name: 'appointment',
      icon: AppointmentIcon,
    },
    {
      name: 'live',
      icon: null, // 특별 처리
    },
    {
      name: 'notice',
      icon: NoticeIcon,
    },
    {
      name: 'profile',
      icon: ProfileIcon,
    },
  ]

  return (
    <View
      style={{
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        height: 85,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        elevation: 4,
      }}>
      {tabs.map((tab) => {
        const isFocused = pathname.startsWith(`/${tab.name}`)

        return (
          <Pressable
            key={tab.name}
            onPress={() => router.push(`/${tab.name}`)}
            style={[
              {
                flex: 1,
                alignItems: 'center',
                borderTopWidth: tab.name !== 'live' ? 1 : 0,
                borderTopColor: isFocused ? colors.primary : colors.secondary,
                marginHorizontal: 10,
                paddingTop: 10,
              },
              tab.name === 'live' && { marginVertical: 8 },
            ]}>
            {tab.name === 'live' ? (
              <View style={{ width: 54 }}>
                <Image
                  source={require('@/assets/icons/live.png')}
                  style={{
                    width: 54,
                    height: 54,
                  }}
                />
              </View>
            ) : (
              <>
                <TabBarIcon
                  Icon={tab.icon}
                  color={isFocused ? colors.primary : colors.secondary}
                />
                <Text
                  style={{
                    color: isFocused ? colors.primary : colors.secondary,
                  }}>
                  {t(tab.name)}
                </Text>
              </>
            )}
          </Pressable>
        )
      })}
    </View>
  )
}
