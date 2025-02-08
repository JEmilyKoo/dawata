import React, { useEffect, useState } from 'react'
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Calendar, LocaleConfig } from 'react-native-calendars'

import {
  ActionSheetProps,
  useActionSheet,
} from '@expo/react-native-action-sheet'
import { useLocalSearchParams } from 'expo-router'
import { router } from 'expo-router'

import { useDispatch } from 'react-redux'
import { resetCreate } from '../../store/slices/appointmentSlice'
import AppointmentCalendar from '@/app/appointment/AppointmentCalendar'
import AppointmentList from '@/app/appointment/AppointmentList'
import ChevronLeftIcon from '@/assets/icons/chevron-left.svg'
import CopyIcon from '@/assets/icons/copy.svg'

import MoreIcon from '@/assets/icons/more.svg'
import PlusIcon from '@/assets/icons/plus.svg'
import AppointmentItem from '@/components/AppointmentItem'
import BackButton from '@/components/BackButton'
import ClubAddModal from '@/components/ClubAddModal'

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
interface ClubInfo {
  clubId: number
  name: string
  img: any
  category: string
}

interface AppointmentInfo {
  appointmentId: number
  name: string
  category: string
  scheduledAt: string
  voteEndTime: string
}

interface ParticipantInfo {
  email: string
  isAttending: boolean
  dailyStatus: string
}

interface VoteInfo {
  content: string
  isSelected: boolean
}

interface AppointmentsInfo {
  clubInfo: ClubInfo
  appointmentInfo: AppointmentInfo
  participantInfo: ParticipantInfo[]
  voteInfo: VoteInfo[]
}
type RouteParams = {
  clubId: string
}

function Appointment() {
  const params = useLocalSearchParams<RouteParams>()
  const myClubs: ClubInfo[] = [
    {
      clubId: 1,
      name: 'No.1',
      img: require('@/assets/clubs/club1.png'),
      category: '#스터디',
    },
    {
      clubId: 2,
      name: '역삼FC',
      img: require('@/assets/clubs/club2.png'),
      category: '#풋살',
    },
    {
      clubId: 3,
      name: 'DogLover',
      img: require('@/assets/clubs/club3.png'),
      category: '#애견',
    },
  ]
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
  const AppointmentInfos: AppointmentsInfo[] = [
    {
      clubInfo: myClubs[0],
      appointmentInfo: {
        appointmentId: 1,
        name: '1월 17일 스터디 • No.1',
        category: '스터디',
        scheduledAt: '2025-02-09T13:00:56',
        voteEndTime: '2025-02-02T13:00:56',
      },
      participantInfo: [
        {
          email: 'user1@example.com',
          isAttending: true,
          dailyStatus: '오늘 참여',
        },
      ],
      voteInfo: [
        {
          content: '역삼 투썸플레이스',
          isSelected: true,
        },
      ],
    },

    {
      clubInfo: myClubs[2],
      appointmentInfo: {
        appointmentId: 2,
        name: '애견모임 • DogLover',
        category: '애견',
        scheduledAt: '2025-02-08T13:00:56',
        voteEndTime: '2025-02-01T13:00:56',
      },
      participantInfo: [
        {
          email: 'user1@example.com',
          isAttending: true,
          dailyStatus: '오늘 참여',
        },
        {
          email: 'user1@example.com',
          isAttending: true,
          dailyStatus: '오늘 참여',
        },
        {
          email: 'user1@example.com',
          isAttending: true,
          dailyStatus: '오늘 참여',
        },
      ],
      voteInfo: [
        {
          content: '역삼 투썸플레이스',
          isSelected: true,
        },
      ],
    },
  ]
  const [markedDates, setMarkedDates] = useState<{ [key: string]: number[] }>(
    {},
  )

  useEffect(() => {
    let newMarkedDates: { [key: string]: number[] } = {}
    AppointmentInfos.forEach((info) => {
      const dateKey = info.appointmentInfo.scheduledAt.split('T')[0] // "YYYY-MM-DD" 형식
      if (newMarkedDates[dateKey]) {
        if (newMarkedDates[dateKey].length > 3) {
          newMarkedDates[dateKey].push(info.clubInfo.clubId % 10)
        }
      } else {
        newMarkedDates[dateKey] = [info.clubInfo.clubId % 10]
      }
    })
    setMarkedDates(newMarkedDates)
  }, [])
  interface Club {
    id: string
    name: string
    image: any
    tag: string
  }

  const dispatch = useDispatch()
  const onPressCreateAppointment = () => {
    dispatch(resetCreate())
    router.push('/appointment/create1')
  }
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* 헤더 */}
      <View className="flex-row p-4 border-b border-bord">
        <TouchableOpacity className="mr-4">
          <BackButton />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-xl font-bold">약속 모아보기</Text>
        </View>
      </View>

      <ScrollView>
        {/* 캘린더 섹션 */}
        <AppointmentCalendar
          markedDates={markedDates}
          appointments={AppointmentInfos.map((info) => info.appointmentInfo)}
        />

        {/* 스터디 목록 */}
        {/* {AppointmentInfos.map((appointmentInfo) => (
          <View className="p-4">
            <AppointmentItem
              key={appointmentInfo.appointmentInfo.appointmentId}
              appointmentInfo={appointmentInfo}
              userImages={userImages}
            />{' '}
          </View>
        ))} */}
        <AppointmentList />
      </ScrollView>

      {/* 플로팅 버튼 */}
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

export default Appointment
