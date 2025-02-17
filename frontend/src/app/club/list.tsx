import { SafeAreaView, ScrollView, Text, View } from 'react-native'

import { useLocalSearchParams } from 'expo-router'

import ClubAddModal from '@/app/club/components/ClubAddModal'
import ClubItem from '@/app/club/components/ClubItem'
import TopHeader from '@/components/TopHeader'

import { useClubList } from './hooks/useClubList'

type RouteParams = {
  clubId: string
}

export default function ClubMain() {
  const params = useLocalSearchParams<RouteParams>()
  const { clubList } = useClubList()
  console.log('clubId:', params)

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TopHeader title="내 그룹" />
      <ScrollView>
        {clubList.map((club) => (
          <View className="m-2 px-4 border-b border-bord">
            <ClubItem clubInfo={club} />
          </View>
        ))}
      </ScrollView>

      <View className="absolute right-4 bottom-8">
        <ClubAddModal />
      </View>
    </SafeAreaView>
  )
}
