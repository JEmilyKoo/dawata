import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { Link, useRouter } from 'expo-router'

import { getAppointments } from '@/apis/appointment'
import { getClubs } from '@/apis/club'
import ChevronRightIcon from '@/assets/icons/chevron-right.svg'
import AppointmentItem from '@/components/AppointmentItem'
import { AppointmentListInfo } from '@/types/appointment'

import AppointmentList from '../appointment/AppointmentList'

interface ClubInfo {
  clubId: string
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
export default function MainScreen() {
  const [appoList, setAppoList] = useState<AppointmentListInfo>()
  const fetchAppointments = async () => {
    try {
      console.log('페이지 처음 마운트 될 때 실행')
      const result = await getAppointments({
        clubId: 1,
        nextRange: 4,
        prevRange: 4,
      })

      console.log('🔍 약속 리스트 조회 결과:', result)
      setAppoList(result)
    } catch (error) {
      console.error('약속 목록을 가져오는 중 오류 발생:', error)
    }
  }

  const fetchClubs = async () => {
    try {
      const result = await getClubs()
      console.log('🔍 클럽 리스트 조회 결과:', result)
    } catch (error) {
      console.error('클럽 목록을 가져오는 중 오류 발생:', error)
    }
  }
  useEffect(() => {
    fetchAppointments()
    fetchClubs()
  }, [])

  const { t } = useTranslation()
  const router = useRouter()

  const myClubs: ClubInfo[] = [
    {
      clubId: '1',
      name: 'No.1',
      img: require('@/assets/clubs/club1.png'),
      category: '#스터디',
    },
    {
      clubId: '2',
      name: '역삼FC',
      img: require('@/assets/clubs/club2.png'),
      category: '#풋살',
    },
    {
      clubId: '3',
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
        scheduledAt: '1월 24일',
        voteEndTime: '1월 23일 오후 6:00',
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
        scheduledAt: '1월 23일 오후 6:00',
        voteEndTime: '1월 22일 오후 6:00',
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

  const handleClubPress = (clubId: string) => {
    router.push({
      pathname: '/club/main',
      params: { clubId },
    })
  }

  return (
    <SafeAreaView className="flex-1 bg-white text-text-primary">
      <ScrollView className="flex-1 bg-white text-text-primary">
        {/* 타이머 섹션 */}
        <View className="items-center p-5">
          <Text className="text-5xl font-bold">00:59</Text>
          <Text className="text-base text-text-primary mt-2">
            일어나야 할 시간까지
          </Text>
          <View className="w-full mt-4 space-y-2">
            <View className="bg-gray-100 p-3 rounded-lg">
              <Text>사워하기 00:15</Text>
            </View>
            <View className="bg-gray-100 p-3 rounded-lg">
              <Text>옷 갈아입기 00:05</Text>
            </View>
          </View>
        </View>

        {/* 내 그룹 섹션 */}
        <View className="p-5">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold">내 그룹</Text>
            <Link href="/club/list">
              <ChevronRightIcon
                height={24}
                width={24}
              />
            </Link>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="space-x-4">
            {myClubs.map((club) => (
              <TouchableOpacity
                key={club.clubId}
                className="items-center p-2"
                onPress={() => handleClubPress(club.clubId)}>
                <Image
                  source={club.img}
                  className="w-20 h-20 rounded-xl mb-2"
                />
                <Text className="text-base font-medium">{club.name}</Text>
                <Text className="text-sm text-gray-500">{club.category}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        {/* 다가오는 약속 섹션 */}
        <View className="p-5">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold">다가오는 약속</Text>
            <TouchableOpacity>
              <Link href="/appointment">
                <ChevronRightIcon
                  height={24}
                  width={24}
                />
              </Link>
            </TouchableOpacity>
          </View>
          {AppointmentInfos.map((appointmentInfo) => (
            <AppointmentItem
              key={appointmentInfo.appointmentInfo.appointmentId}
              appointmentInfo={appoList}
              userImages={userImages}
            />
            // TODO: appointmentInfo 인터페이스 수정 필요
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
