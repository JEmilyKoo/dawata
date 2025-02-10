import { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { AppointmentDetailInfo } from '@/types/appointment'
import { AppointmentDetailInfo, VoteInfo } from '@/types/appointment'

export default function AppointmentNotSelectedDetail({
  appointmentDetail,
}: {
  appointmentDetail: AppointmentDetailInfo
}) {
  // 로컬 상태 관리
  const [selectedVotes, setSelectedVotes] = useState<VoteInfo[]>(
    appointmentDetail.voteInfos,
  )

  // 체크박스 선택 시 로컬 상태만 업데이트
  const handleSelect = (voteItemId: number, isSelected: boolean) => {
    setSelectedVotes((prev) =>
      prev.map((vote) =>
        vote.voteItemId === voteItemId ? { ...vote, isSelected } : vote,
      ),
    )
  }

  // TODO: 투표하기 버튼 클릭 시 API 요청
  const handleVoteSubmit = async () => {}

  return (
    <View>
      <Text>AppointmentNotSelectedDetail</Text>
    </View>
  )
}
