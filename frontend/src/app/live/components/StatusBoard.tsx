import { ScrollView, TouchableOpacity, View } from 'react-native'

import ArrowLeftIcon from '@/assets/icons/chevron-left.svg'
import { LiveMember } from '@/types/live'

import AttendanceToggle from './AttendanceToggle'
import { MemberDetailItem } from './MemberDetailItem'

export const StatusBoard = ({
  liveMembers,
  setShowStatusBoard,
  liveAppointmentId,
}: {
  liveMembers: LiveMember[]
  setShowStatusBoard: (show: boolean) => void
  liveAppointmentId: number
}) => {
  return (
    <View className="absolute top-0 left-0 right-0 bottom-0 w-full h-full z-30 bg-white">
      <View className="flex-row jusitfy-center items-center w-full py-4">
        <TouchableOpacity
          onPress={setShowStatusBoard}
          className="absolute p-4">
          <ArrowLeftIcon
            width="24"
            height="24"
          />
        </TouchableOpacity>
        <View className="w-full">
          <AttendanceToggle />
        </View>
      </View>
      <ScrollView className="w-full px-4">
        {liveMembers.map((member) => (
          <MemberDetailItem
            key={member.memberId}
            liveAppointmentId={liveAppointmentId}
            member={member}
          />
        ))}
      </ScrollView>
    </View>
  )
}
export default StatusBoard
