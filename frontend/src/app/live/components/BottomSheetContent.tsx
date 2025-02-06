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
  setSelectedMemberId,
}: {
  liveMembers: LiveMember[]
  selectedMemberId: number
  setSelectedMemberId: (id: number) => void
}) => {
  const [selectedMember, setSelectedMember] = useState<LiveMember | null>(null)
  const [showStatusBoard, setShowStatusBoard] = useState(false)
  useEffect(() => {
    if (selectedMemberId) {
      setSelectedMember(
        liveMembers.find((member) => member.id === selectedMemberId) || null,
      )
    }
  }, [selectedMemberId])

  return (
    <View className="flex-1 p-4">
      {showStatusBoard && (
        <StatusBoard
          liveMembers={liveMembers}
          setShowStatusBoard={() => setShowStatusBoard(false)}
        />
      )}


      <View className="mb-5">
        <View className="flex-row justify-center mb-5">
          <AttendanceToggle />
          <TouchableOpacity onPress={() => setShowStatusBoard(true)}>
            <ChevronRightIcon
              height={24}
              width={24}
            />
          </TouchableOpacity>
        </View>
        <LiveMemberList
          liveMembers={liveMembers}
          selectedMemberId={selectedMemberId}
          setSelectedMemberId={setSelectedMemberId}
        />
        {selectedMemberId && <MemberDetailItem member={selectedMember} />}
      </View>
    </View>
  )
}
export default BottomSheetContent
