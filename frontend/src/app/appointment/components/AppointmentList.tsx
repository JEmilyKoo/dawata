import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  View,
} from 'react-native'

import AppointmentItem from '@/components/AppointmentItem'
import { AppointmentListInfo } from '@/types/appointment'

import { getSelectedDate } from '../hooks/SelectedDateInitial'

function AppointmentList({
  appointments,
  loading,
  selectedDate,
  setSelectedDate,
}: {
  appointments: AppointmentListInfo[]
  loading: boolean

  selectedDate: string | null // 수정: null 가능하도록 변경
  setSelectedDate: React.Dispatch<React.SetStateAction<string | null>>
}) {
  // const [appointments, setAppointments] = useState<AppointmentListInfo[]>([])

  // const testappointments = dummyAppointmentList

  // TODO: 스크롤할 때 첫 번째 보이는 약속을 기준으로 selectedDate 변경
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const yOffset = event.nativeEvent.contentOffset.y
    const itemHeight = 80 // 리스트 아이템의 높이 (임의 설정)
    const index = Math.floor(yOffset / itemHeight) // 현재 가장 위에 보이는 아이템 인덱스 계산

    if (appointments[index]) {
      // setSelectedDate(
      //   getSelectedDateFromAppointment(appointments[index].appointmentInfo),
      // ) // ✅ 스크롤 시 selectedDate 변경
    }
  }

  if (loading) {
    return <ActivityIndicator testID="loading-indicator" />
  }
  return (
    <View>
      <ScrollView
        testID="appointment-list"
        onScroll={handleScroll} // ✅ 스크롤 이벤트 추가
        scrollEventThrottle={16} // 성능 최적화
      >
        {appointments.length > 0 ? (
          appointments
            .filter(
              (appointmentListInfo) =>
                appointmentListInfo.voteStatus !== 'NOT_PARTICIPANT',
            )
            .map((appointmentListInfo) => (
              <View
                key={appointmentListInfo.appointmentInfo.appointmentId}
                className="p-4">
                <AppointmentItem appointmentListInfo={appointmentListInfo} />
              </View>
            ))
        ) : (
          <Text>예정된 약속이 없습니다.</Text>
        )}
      </ScrollView>
    </View>
  )
}

export default AppointmentList
