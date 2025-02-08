import React from 'react'
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Calendar, LocaleConfig } from 'react-native-calendars'

import { useActionSheet } from '@expo/react-native-action-sheet'
import { useLocalSearchParams } from 'expo-router'

import ChevronLeftIcon from '@/assets/icons/chevron-left.svg'
import CopyIcon from '@/assets/icons/copy.svg'
import MoreIcon from '@/assets/icons/more.svg'
import PlusIcon from '@/assets/icons/plus.svg'
import BackButton from '@/components/BackButton'
import ClubAddModal from '@/components/ClubAddModal'

import AppointmentList from './components/ClubAppointmentList'
import ClubHeader from './components/ClubHeader'
import ClubMemberList from './components/ClubMemberList'
import { useClubAppointments } from './hooks/useClubAppointments'
import { useClub } from './hooks/useClubInfo'

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

type RouteParams = {
  clubId: string
}

function ClubMain() {
  const params = useLocalSearchParams<RouteParams>()
  const { appointments, loading } = useClubAppointments({
    clubId: Number(params.clubId),
  })
  const { clubInfo, loading: clubInfoLoading } = useClub({
    clubId: Number(params.clubId),
  })

  const markedDates = {
    '2025-01-21': { marked: true, dotColor: '#ff8339' },
    '2025-01-22': { marked: true, dotColor: '#ff8339' },
    '2025-01-23': { marked: true, dotColor: '#ff8339' },
    '2025-01-24': { marked: true, dotColor: '#ff8339' },
    '2025-01-25': { marked: true, dotColor: '#ff8339' },
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

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* 헤더 */}
      <ClubHeader
        name={clubInfo?.name}
        category={clubInfo?.category}
        teamCode={clubInfo?.teamCode}
      />
      <ScrollView>
        <ClubMemberList
          clubId={Number(params.clubId)}
          members={[]}
        />

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
          />
        </View>

        <AppointmentList
          appointments={appointments}
          myClubs={myClubs}
        />
      </ScrollView>

      <View className="absolute right-4 bottom-8">
        <ClubAddModal />
      </View>
    </SafeAreaView>
  )
}

export default ClubMain
