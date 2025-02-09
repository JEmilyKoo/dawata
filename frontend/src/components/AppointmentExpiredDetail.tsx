import { Text, View } from 'react-native'

import { AppointmentDetailInfo } from '@/types/appointment'

export default function AppointmentExpiredDetail({
  appointmentDetail,
}: {
  appointmentDetail: AppointmentDetailInfo
}) {
  console.log('투표 정보 : ', appointmentDetail?.voteInfos[0])

  return (
    // TODO: 투표 관련 더미 데이터 추가 후 각 컴포넌트 별 데이터 추가 (현재 voteInfos 데이터가 없음)
    <View>
      <Text>AppointmentExpiredDetail</Text>
      {/* <Text>{appointmentDetail?.voteInfos[0].title}</Text>
      <Text>{appointmentDetail?.voteInfos[0].category}</Text>
      <Text>{appointmentDetail?.voteInfos[0].detail}</Text>
      <Text>{appointmentDetail?.voteInfos[0].linkUrl}</Text>
      <Text>{appointmentDetail?.voteInfos[0].roadAddress}</Text>
      <Text>{appointmentDetail?.voteInfos[0].latitude}</Text>
      <Text>{appointmentDetail?.voteInfos[0].longitude}</Text>
      <Text>{appointmentDetail?.voteInfos[0].isSelected}</Text>
      <Text>{appointmentDetail?.voteInfos[0].percentage}</Text> */}
    </View>
  )
}
