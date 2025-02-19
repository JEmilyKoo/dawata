import React, { useState } from 'react'
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Calendar, LocaleConfig } from 'react-native-calendars'
import { useDispatch } from 'react-redux'

import { useLocalSearchParams, useRouter } from 'expo-router'

import PlusIcon from '@/assets/icons/plus.svg'
import { Club } from '@/types/club'

import {
  initCreate,
  resetVote,
  setCreateCategory,
  setCreateMemberIds,
} from '../../store/slices/appointmentSlice'
import AppointmentList from './components/ClubAppointmentList'
import ClubHeader from './components/ClubHeader'
import ClubMemberList from './components/ClubMemberList'
import { useClubAppointments } from './hooks/useClubAppointments'
import { useClub } from './hooks/useClubInfo'
import { useClubMemberList } from './hooks/useClubMemberList'
import { useMarkedDates } from './hooks/useMarkedDates'

LocaleConfig.locales['kr'] = {
  monthNames: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
}
LocaleConfig.defaultLocale = 'kr'

export type RouteParams = {
  clubId: string
}

function ClubMain() {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(
    today.getFullYear() +
      '-' +
      (today.getMonth() + 1).toString().padStart(2, '0'),
  )
  const params = useLocalSearchParams<RouteParams>()
  const { appointments, loading } = useClubAppointments({
    clubId: Number(params.clubId),
    date: currentMonth,
  })
  const { clubInfo, loading: clubInfoLoading } = useClub({
    clubId: Number(params.clubId),
  })
  const { clubMemberList } = useClubMemberList({
    clubId: Number(params.clubId),
  })

  const { markedDates } = useMarkedDates({ appointments })
  const handleMonthChange = (changedMonth: { year: number; month: number }) => {
    const formattedMonth = `${changedMonth.year}-${String(changedMonth.month).padStart(2, '0')}`
    setCurrentMonth(formattedMonth)
  }

  interface Club {
    id: string
    name: string
    image: any
    tag: string
  }

  const myClubs: Club[] = [
    {
      id: '1',
      name: 'No.1',
      image: require('@/assets/clubs/club1.png'),
      tag: '#스터디',
    },
  ]
  const router = useRouter()
  const dispatch = useDispatch()
  const onPressCreateAppointment = () => {
    dispatch(initCreate(params.clubId))
    if (clubInfo) {
      dispatch(setCreateCategory(clubInfo.category))
      dispatch(
        setCreateMemberIds(clubInfo?.members.map((member) => member.memberId)),
      )
    }
    dispatch(resetVote())

    router.push('/appointment/create1')
  }
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* 헤더 */}
      {clubInfo && (
        <ClubHeader
          name={clubInfo.name}
          category={clubInfo.category}
          teamCode={clubInfo.teamCode}
          img={clubInfo.img}
          clubId={Number(params.clubId)}
        />
      )}
      <ScrollView>
        <ClubMemberList clubId={Number(params.clubId)} />
        <View className="p-4">
          <Text className="text-lg font-bold mb-4">No.1 캘린더</Text>
          <Calendar
            className="border border-bord rounded-lg p-2"
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#9c9c9c',
              selectedDayBackgroundColor: '#ff8339',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#ff8339',
              dayTextColor: '#1f1f1f',
              textDisabledColor: '#e6e6e6',
              dotColor: '#ff8339',
              selectedDotColor: '#ffffff',
              arrowColor: '#ff8339',
              monthTextColor: '#1f1f1f',
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 14,
            }}
            markedDates={markedDates}
            markingType={'dot'}
            enableSwipeMonths={true}
            current={'2025-01-21'}
            onMonthChange={handleMonthChange}
          />
        </View>

        <AppointmentList
          appointments={appointments}
          clubImg={clubInfo?.img}
        />
      </ScrollView>

      <View className="absolute right-4 bottom-8">
        <TouchableOpacity
          onPress={onPressCreateAppointment}
          className="absolute right-4 bottom-8 w-14 h-14 rounded-full bg-primary items-center justify-center shadow-lg">
          <PlusIcon
            height={30}
            width={30}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default ClubMain
