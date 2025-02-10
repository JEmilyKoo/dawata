import { Image, SafeAreaView, ScrollView, Text, View } from 'react-native'

import { useLocalSearchParams, useRouter } from 'expo-router'

import { useClubMemberList } from './hooks/useClubMemberList'

type RouteParams = {
  clubId: string
}

export const ClubMemberList = () => {
  const params = useLocalSearchParams<RouteParams>()
  const clubId = Number(params.clubId)
  const { clubMemberList } = useClubMemberList({ clubId })
  return (
    <SafeAreaView>
      <ScrollView>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginVertical: 10 }}>
          클럽 멤버 목록
        </Text>
        {clubMemberList.map((item, index) => (
          <View
            key={index}
            style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                {item.nickname}
              </Text>
              <Text>{item.email}</Text>
            </View>
          </View>
        ))}
        {clubMemberList.length === 0 && <Text>멤버가 없습니다.</Text>}
      </ScrollView>
    </SafeAreaView>
  )
}
