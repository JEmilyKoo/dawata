import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'

import { LiveMember } from '@/types/live'

const userImages = [
  require('@/assets/avatars/user1.png'),
  require('@/assets/avatars/user2.png'),

  require('@/assets/avatars/user3.png'),
  require('@/assets/avatars/user4.png'),
  require('@/assets/avatars/user5.png'),
  require('@/assets/avatars/user6.png'),
  require('@/assets/avatars/user7.png'),
  require('@/assets/avatars/user8.png'),
  require('@/assets/avatars/user1.png'),
  require('@/assets/avatars/user2.png'),
  require('@/assets/avatars/user3.png'),
  require('@/assets/avatars/user4.png'),
  require('@/assets/avatars/user5.png'),
  require('@/assets/avatars/user6.png'),
  require('@/assets/avatars/user7.png'),
  require('@/assets/avatars/user8.png'),
]
export const LiveMemberList = ({
  liveMembers,
  selectedMemberId,

  setSelectedMemberId,
}: {
  liveMembers: LiveMember[]
  selectedMemberId: number
  setSelectedMemberId: (id: number) => void
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}>
      <View className="flex-row flex-wrap justify-between py-2">
        {liveMembers.map((member) => (
          <TouchableOpacity
            key={member.id}
            className={`p-2 mr-2 rounded-xl min-w-16 items-center`}
            onPress={() => setSelectedMemberId(member.id)}>
            <Image
              source={userImages[member.id]}
              className={`w-12 h-12 rounded-full mb-2 ${selectedMemberId === member.id ? 'border-2 border-blue-500' : ''}`}
              style={{ width: 48, height: 48 }}
            />
            <Text className="text-base font-semibold mb-1">
              {member.nickname}
            </Text>
            <Text className="text-xs text-gray-500">{member.eta}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )
}

export default LiveMemberList
