import { Text, View } from 'react-native'

import { AppointmentDetailInfo } from '@/types/appointment'

export default function AppointmentSelectedDetail({
  appointmentDetail,
}: {
  appointmentDetail: AppointmentDetailInfo
}) {
  return (
    <View>
      <Text>AppointmentSelectedDetail</Text>
    </View>
  )
}
