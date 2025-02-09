import { Text, View } from 'react-native'

import { AppointmentDetailInfo } from '@/types/appointment'

export default function AppointmentNotSelectedDetail({
  appointmentDetail,
}: {
  appointmentDetail: AppointmentDetailInfo
}) {
  return (
    <View>
      <Text>AppointmentNotSelectedDetail</Text>
    </View>
  )
}
