import React from 'react'
import {
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
import ClubAddModal from '@/app/club/components/ClubAddModal'
import ClubItem from '@/components/ClubItem'

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

interface ParticipantInfo {
  email: string
  name: string
  img: any
  createdAt: string
}

interface ClubInfo {
  clubId: string
  name: string
  img: any
  category: string
  createdAt: string
  participantInfo: ParticipantInfo[]
}

const clubInfo: ClubInfo[] = [
  {
    clubId: '1',
    name: 'No.1',
    img: require('@/assets/clubs/club1.png'),
    category: '스터디',
    createdAt: '2025-01-07',
    participantInfo: [
      {
        email: 'test@test.com',
        name: '테스트',
        img: require('@/assets/avatars/user1.png'),
        createdAt: '2025-01-07',
      },
    ],
  },
  {
    clubId: '2',
    name: '역삼FC',
    img: require('@/assets/clubs/club2.png'),
    category: '축구',
    createdAt: '2025-01-07',
    participantInfo: [
      {
        email: 'test@test.com',
        name: '테스트',
        img: require('@/assets/avatars/user1.png'),
        createdAt: '2025-01-07',
      },
      {
        email: 'test@test.com',
        name: '테스트',
        img: require('@/assets/avatars/user2.png'),
        createdAt: '2025-01-07',
      },
      {
        email: 'test@test.com',
        name: '테스트',
        img: require('@/assets/avatars/user1.png'),
        createdAt: '2025-01-07',
      },
    ],
  },
]
export default function ClubMain() {
  const { showActionSheetWithOptions } = useActionSheet()
  const params = useLocalSearchParams<RouteParams>()
  console.log('clubId:', params)

  const markedDates = {
    '2025-01-21': { marked: true, dotColor: '#ff8339' },
    '2025-01-22': { marked: true, dotColor: '#ff8339' },
    '2025-01-23': { marked: true, dotColor: '#ff8339' },
    '2025-01-24': { marked: true, dotColor: '#ff8339' },
    '2025-01-25': { marked: true, dotColor: '#ff8339' },
  }

  const _showActionSheet = () => {
    const options = ['새로운 그룹 생성', '기존 그룹 참가', '취소']
    const cancelButtonIndex = 2

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        title: '그룹 선택',
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          console.log('새로운 그룹 생성')
        } else if (buttonIndex === 1) {
          console.log('기존 그룹 참가')
        } else {
          console.log('취소')
        }
      },
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* 헤더 */}
      <View className="flex-row p-4 border-b border-bord">
        <BackButton />
        <Text className="text-xl font-bold mt-2">내 그룹</Text>
      </View>

      <ScrollView>
        {clubInfo.map((club) => (
          <View className="m-2 px-4 border-b border-bord">
            <ClubItem clubInfo={club} />
          </View>
        ))}
      </ScrollView>

      {/* 플로팅 버튼 */}
      <View className="absolute right-4 bottom-8">
        <ClubAddModal />
      </View>
    </SafeAreaView>
  )
}
