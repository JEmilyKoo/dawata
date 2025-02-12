import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  View,
} from 'react-native'

import { getAppointments } from '@/apis/appointment'
import AppointmentItem from '@/components/AppointmentItem'
import { AppointmentListInfo } from '@/types/appointment'

import { dummyAppointmentList } from '../dummyAppointmentList'
import { getSelectedDate } from '../hooks/SelectedDateInitial'

const AppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentListInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string | null>(null) // ✅ selectedDate 추가

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAppointments({
          clubId: 1,
          nextRange: 4,
          prevRange: 4,
        })
        setAppointments(data || [])
        setSelectedDate(
          getSelectedDate(
            data.map((a: AppointmentListInfo) => a.appointmentInfo),
          ),
        ) // ✅ 초기 selectedDate 설정
      } catch (error) {
        console.error('Failed to fetch appointments', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  // const testappointments = dummyAppointmentList

  // TODO: 스크롤할 때 첫 번째 보이는 약속을 기준으로 selectedDate 변경
  // const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
  //   const yOffset = event.nativeEvent.contentOffset.y
  //   const itemHeight = 80 // 리스트 아이템의 높이 (임의 설정)
  //   const index = Math.floor(yOffset / itemHeight) // 현재 가장 위에 보이는 아이템 인덱스 계산

  //   if (appointments[index]) {
  //     setSelectedDate(
  //       getSelectedDateFromAppointment(appointments[index].appointmentInfo),
  //     ) // ✅ 스크롤 시 selectedDate 변경
  //   }
  // }

  if (loading) {
    return <ActivityIndicator testID="loading-indicator" />
  }

  const userImages = [
    require('@/assets/avatars/user1.png'),
    require('@/assets/avatars/user2.png'),
    require('@/assets/avatars/user3.png'),
    require('@/assets/avatars/user4.png'),
    require('@/assets/avatars/user5.png'),
    require('@/assets/avatars/user6.png'),
    require('@/assets/avatars/user7.png'),
    require('@/assets/avatars/user8.png'),
  ]

  return (
    <View>
      {/* ✅ 현재 선택된 날짜 표시
      <Text testID="selected-date">선택된 날짜: {selectedDate || '없음'}</Text> */}

      <ScrollView
        testID="appointment-list"
        // onScroll={handleScroll} // ✅ 스크롤 이벤트 추가
        // scrollEventThrottle={16} // 성능 최적화
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
                <AppointmentItem
                  appointmentListInfo={appointmentListInfo}
                  userImages={userImages}
                />
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
