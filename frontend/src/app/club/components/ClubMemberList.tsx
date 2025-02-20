import React from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

import MoreIcon from '@/assets/icons/more.svg'
import DropDown from '@/components/DropDown'
import ImageThumbnail from '@/components/ImageThumbnail'
import { ClubMemberListProps } from '@/types/club'

import { useClub } from '../hooks/useClubInfo'

const ClubMemberList: React.FC<ClubMemberListProps> = ({ clubId }) => {
  const { clubInfo, loading: clubInfoLoading } = useClub({ clubId })
  const clubMembers = clubInfo?.members || []

  return (
    <View className="p-4 border-b border-bord">
      <DropDown title="멤버리스트">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}>
          <View className="flex-row mx-4">
            {clubMembers.map((member, index) => (
              <View
                key={index}
                className="flex-col mr-4">
                <View className="items-center mb-4">
                  <ImageThumbnail
                    img={member.img}
                    width={48}
                    height={48}
                    defaultImg={require('@/assets/avatars/user1.png')}
                    className="rounded-full"
                  />
                  <Text className="text-xs">{member.nickname}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </DropDown>
    </View>
  )
}

export default ClubMemberList
