import React from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

import MoreIcon from '@/assets/icons/more.svg'
import { ClubMemberListProps } from '@/types/club'

import { useClub } from '../hooks/useClubInfo'

const ClubMemberList: React.FC<ClubMemberListProps> = ({ clubId, members }) => {
  const { clubInfo, loading: clubInfoLoading } = useClub({ clubId })
  const clubMembers = clubInfo?.members || []

  return (
    <View className="p-4 border-b border-bord">
      <TouchableOpacity className="flex-row justify-between items-center p-3 border border-bord rounded-lg mb-4">
        <Text className="text-base">멤버 리스트</Text>
        <MoreIcon
          height={20}
          width={20}
        />
      </TouchableOpacity>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}>
        <View className="flex-row">
          {clubMembers.map((member, index) => (
            <View
              key={index}
              className="flex-col mr-4">
              <View className="items-center mb-4">
                <View className="w-12 h-12 rounded-full bg-gray-200 mb-1" />
                <Text className="text-xs">{member.nickname}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

export default ClubMemberList
