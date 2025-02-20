import { Text, View } from 'react-native'

import { AppointmentDetailInfo } from '@/types/appointment'

export default function AppointmentExpiredDetail({
  appointmentDetail,
}: {
  appointmentDetail: AppointmentDetailInfo
}) {
  console.log('투표 정보 : ', appointmentDetail?.voteInfos[0])

  return (
    <View>
      <Text>AppointmentExpiredDetail</Text>
    </View>
  )
}
