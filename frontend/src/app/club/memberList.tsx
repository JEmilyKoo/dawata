import { Image, SafeAreaView, ScrollView, Text, View } from 'react-native'

import { useLocalSearchParams, useRouter } from 'expo-router'

import { useClubMemberList } from './hooks/useClubMemberList'

type RouteParams = {
  clubId: string
}

const ClubMemberList = () => {
  const params = useLocalSearchParams<RouteParams>()
  const clubId = Number(params.clubId)
  const { clubMemberList } = useClubMemberList({ clubId })
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <Text className="text-xl font-bold mb-2 text-text-primary flex-row justify-between items-center p-3 border border-bord rounded-lg mb-4">
          클럽 멤버 목록
        </Text>
        {clubMemberList.map((item, index) => (
          <View
            key={index}
            className="flex-row p-2.5 items-center">
            <View>
              <Text className="text-xl font-bold mb-2 text-text-primary">
                {item.nickname}
              </Text>
              <Text className="text-xs font-bold mb-2 text-text-secondary">
                {item.email}
              </Text>
            </View>
          </View>
        ))}
        {clubMemberList.length === 0 && <Text>멤버가 없습니다.</Text>}
      </ScrollView>
    </SafeAreaView>
  )
}

export default ClubMemberList
