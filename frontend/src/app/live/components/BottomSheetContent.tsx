import { useEffect, useState } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'

import AttendanceToggle from '@/app/live/components/AttendanceToggle'
import ChevronRightIcon from '@/assets/icons/chevron-right.svg'
import { LiveMember } from '@/types/live'

import { LiveMemberList } from './LiveMemberList'
import { MemberDetailItem } from './MemberDetailItem'
import { StatusBoard } from './StatusBoard'

const BottomSheetContent = ({
  liveMembers,
  selectedMemberId,
  liveAppointmentId,
  setSelectedMemberId,
}: {
  liveMembers: LiveMember[]
  liveAppointmentId: number
  selectedMemberId: number
  setSelectedMemberId: (id: number) => void
}) => {
  const [selectedMember, setSelectedMember] = useState<LiveMember | null>(null)
  const [showStatusBoard, setShowStatusBoard] = useState(false)
  useEffect(() => {
    if (selectedMemberId) {
      setSelectedMember(
        liveMembers.find((member) => member.memberId === selectedMemberId) ||
          null,
      )
    }
  }, [selectedMemberId])

  return (
    <View className="flex-1">
      {showStatusBoard && (
        <StatusBoard
          liveAppointmentId={liveAppointmentId}
          liveMembers={liveMembers}
          setShowStatusBoard={() => setShowStatusBoard(false)}
        />
      )}

      <View className="mb-5">
        <View className="p-4 flex-row justify-center items-center mb-5 w-full">
          <View className="flex-row justify-center items-center">
            <AttendanceToggle />
          </View>
          <TouchableOpacity
            onPress={() => setShowStatusBoard(true)}
            className="absolute right-0 p-4">
            <ChevronRightIcon
              height={24}
              width={24}
            />
          </TouchableOpacity>
        </View>
        <View className="px-4">
          <LiveMemberList
            liveMembers={liveMembers}
            selectedMemberId={selectedMemberId}
            setSelectedMemberId={setSelectedMemberId}
          />
          {selectedMemberId && (
            <MemberDetailItem
              liveAppointmentId={liveAppointmentId}
              member={selectedMember}
            />
          )}
        </View>
      </View>
    </View>
  )
}
export default BottomSheetContent
