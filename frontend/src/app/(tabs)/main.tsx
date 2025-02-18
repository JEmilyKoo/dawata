import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { Link, useRouter } from 'expo-router'

import { getAppointments } from '@/apis/appointment'
import { getClubs } from '@/apis/club'
import ChevronRightIcon from '@/assets/icons/chevron-right.svg'
import AppointmentItem from '@/components/AppointmentItem'
import ImageThumbnail from '@/components/ImageThumbnail'
import Colors from '@/constants/Colors'
import { setClubs } from '@/store/slices/clubSlice'
import { RootState } from '@/store/store'
import { AppointmentListInfo } from '@/types/appointment'
import { Club } from '@/types/club'

import MainPlayList from '../routine/components/MainPlayList'

export default function MainScreen() {
  const dispatch = useDispatch()
  const { clubs } = useSelector((state: RootState) => state.club)
  const [appoList, setAppoList] = useState<AppointmentListInfo[]>([])
  // TODO: 추후 코드가 정돈되면 appoList를 appointmentList로 바꿀 것.
  const [showClubLoading, setShowClubLoading] = useState(false)
  const [showAppoLoading, setShowAppoLoading] = useState(false)
  const [isClubEmpty, setIsClubEmpty] = useState(false)
  const [isAppoEmpty, setIsAppoEmpty] = useState(false)

  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(
    today.getFullYear() +
      '-' +
      (today.getMonth() + 1).toString().padStart(2, '0'),
  )
  //
  const fetchAppointments = async () => {
    try {
      setShowAppoLoading(true)
      const result = await getAppointments({
        date: currentMonth,
        nextRange: 99,
        prevRange: 0,
      })
      if (result) {
        setAppoList(result.data)
      }
    } catch (error) {
      console.error('약속 목록을 가져오는 중 오류 발생:', error)
    } finally {
      setShowAppoLoading(false)
    }
  }

  const fetchClubs = async () => {
    try {
      setShowClubLoading(true)
      const result = await getClubs()
      if (result) {
        dispatch(setClubs(result))
      }
    } catch (error) {
      console.error('클럽 목록을 가져오는 중 오류 발생:', error)
    } finally {
      setShowClubLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
    fetchClubs()
  }, [])

  useEffect(() => {
    setIsClubEmpty(!showClubLoading && clubs.length == 0)
  }, [showClubLoading, clubs])

  useEffect(() => {
    setIsAppoEmpty(!showAppoLoading && appoList.length == 0)
  }, [showAppoLoading])

  const { t } = useTranslation()
  const router = useRouter()

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

  const handleClubPress = (clubId: number) => {
    router.push({
      pathname: '/club/main',
      params: { clubId },
    })
  }

  return (
    <SafeAreaView className="flex-1 bg-white text-text-primary">
      <ScrollView className="flex-1 bg-white text-text-primary">
        {/* 타이머 섹션 */}
        {/* <View className="items-center p-5">
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
        </View> */}
        <MainPlayList />

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

          {isClubEmpty && (
            <Text>{isClubEmpty && t('mainPage.club.empty')}</Text>
          )}
          {showClubLoading && (
            <View className="inset-0 items-center justify-center">
              <ActivityIndicator
                size="small"
                color={Colors.primary}
              />
            </View>
          )}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="space-x-4">
            {!showClubLoading &&
              clubs.map((club) => (
                <TouchableOpacity
                  key={club.clubId}
                  className=" relativeitems-center p-2 w-[100px]"
                  onPress={() => handleClubPress(club.clubId)}>
                  <ImageThumbnail
                    img={club.img}
                    defaultImg={require('@/assets/clubs/club1.png')}
                    width={80}
                    height={80}
                    className="rounded-xl"
                  />
                  <Text className="px-2 text-base font-medium text-center line-clamp-2 w-full">
                    {club.name}
                  </Text>
                  <Text className="text-sm text-text-secondary text-center w-full">
                    {t(`category.${club.category}`)}
                  </Text>
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
          {showAppoLoading && (
            <View className="inset-0 items-center justify-center">
              <ActivityIndicator
                size="small"
                color={Colors.primary}
              />
            </View>
          )}
          {appoList &&
            appoList.map((appoListItem) => (
              <AppointmentItem
                key={appoListItem.appointmentInfo.appointmentId}
                appointmentListInfo={appoListItem}
              />
            ))}
          {isAppoEmpty && <Text>{t('mainPage.appointment.empty')}</Text>}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
