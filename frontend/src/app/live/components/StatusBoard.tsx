import { ScrollView, TouchableOpacity, View } from 'react-native'

import ArrowLeftIcon from '@/assets/icons/chevron-left.svg'
import { LiveMember } from '@/types/live'

import AttendanceToggle from './AttendanceToggle'
import { MemberDetailItem } from './MemberDetailItem'

export const StatusBoard = ({
  liveMembers,
  setShowStatusBoard,
}: {
  liveMembers: LiveMember[]
  setShowStatusBoard: (show: boolean) => void
}) => {
  return (
    <View className="absolute top-0 left-0 right-0 bottom-0  w-full h-full z-30 bg-white">
      <TouchableOpacity
        onPress={setShowStatusBoard}
        style={{ padding: 10 }}>
        <ArrowLeftIcon
          width="24"
          height="24"
        />
      </TouchableOpacity>
      <AttendanceToggle />
      <ScrollView className="flex-wrap w-full px-4">
        {liveMembers.map((member) => (
          <MemberDetailItem
            key={member.id}
            member={member}
          />
        ))}
      </ScrollView>
    </View>
  )
}
