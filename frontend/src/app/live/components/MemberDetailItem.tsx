import { Image, Text, TouchableOpacity, View } from 'react-native'

import CallIcon from '@/assets/icons/call.svg'
import HurryIcon from '@/assets/icons/hurry.svg'
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
export const MemberDetailItem = ({ member }: { member: LiveMember | null }) => {
  return (
    member && (
      <View>
        <View
          className="flex-row p-4 border-2 border-bord rounded-2xl my-2 justify-between items-center pb-4 rounded-xl"
          key={member.id}>
          <Image
            source={userImages[member.id]}
            style={{ width: '3rem', height: '3rem' }}
            className="w-6 h-6 rounded-full border-4 border-light-red"
          />
          <View className="flex-1 ml-3">
            <Text className="text-lg font-semibold text-text-primary">
              {member.nickname}
            </Text>
            <Text className="text-sm text-light-red">
              {member.eta} 후 도착 예정
            </Text>
          </View>
          <View className="flex-row gap-2">
            <TouchableOpacity className="p-2 rounded-full items-center">
              <View className="size-8 bg-primary rounded-full items-center justify-center">
                <HurryIcon
                  width={14}
                  height={14}
                />
              </View>
              <Text className="text-xs text-text-primary pt-1">재촉</Text>
            </TouchableOpacity>

            <TouchableOpacity className="p-2 rounded-full items-center">
              <View className="size-8 bg-light-green rounded-full items-center justify-center">
                <CallIcon
                  width={14}
                  height={14}
                />
              </View>
              <Text className="text-xs text-text-primary pt-1">화상통화</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  )
}
