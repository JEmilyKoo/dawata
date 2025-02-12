import { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import VoteItem from '@/app/appointment/components/VoteItem'
import DropDown from '@/components/DropDown'
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
      <DropDown title="장소 투표">
        <View>
          {selectedVotes.map((vote) => (
            <VoteItem
              key={vote.voteItemId}
              voteInfo={vote}
              onSelect={handleSelect}
            />
          ))}

          <TouchableOpacity
            className="mt-4 px-4 py-4 bg-primary rounded-full"
            onPress={handleVoteSubmit}>
            <Text className="text-white text-center font-bold">투표하기</Text>
          </TouchableOpacity>
        </View>
      </DropDown>
    </View>
  )
}
