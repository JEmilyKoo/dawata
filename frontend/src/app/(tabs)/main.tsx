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

export default function MainScreen() {
  const dispatch = useDispatch()
  const { clubs } = useSelector((state: RootState) => state.club)
  const [appoList, setAppoList] = useState<AppointmentListInfo[]>([])
  // TODO: 추후 코드가 정돈되면 appoList를 appointmentList로 바꿀 것.
  const [showClubLoading, setShowClubLoading] = useState(false)

  const fetchAppointments = async () => {
    try {
      console.log('페이지 처음 마운트 될 때 실행')
      const result: AppointmentListInfo[] = await getAppointments({
        clubId: 1,
        nextRange: 4,
        prevRange: 4,
      })

      console.log('🔍 약속 리스트 조회 결과:', result)
      if (result) {
        setAppoList(result)
      }
    } catch (error) {
      console.error('약속 목록을 가져오는 중 오류 발생:', error)
    }
  }

  const fetchClubs = async () => {
    try {
      setShowClubLoading(false)
      const result: Club[] | null = await getClubs()
      dispatch(setClubs(result))
      setShowClubLoading(true)
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
          {!showClubLoading && (
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
            {showClubLoading &&
              clubs.map((club) => (
                <TouchableOpacity
                  key={club.clubId}
                  className=" relativeitems-center p-2 w-[100px]"
                  onPress={() => handleClubPress(club.clubId)}>
                  <ImageThumbnail
                    img={'https://picsum.photos/80'}
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
          {appoList &&
            appoList.map((appoListItem) => (
              <AppointmentItem
                key={appoListItem.appointmentInfo.appointmentId}
                appointmentListInfo={appoListItem}
                userImages={userImages}
              />
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
