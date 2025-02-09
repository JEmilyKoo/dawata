import { useState } from 'react'
import { useEffect } from 'react'
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Calendar, LocaleConfig } from 'react-native-calendars'
import { useSelector } from 'react-redux'

import { useRoute } from '@react-navigation/native'
import { useRouter } from 'expo-router'
import { useLocalSearchParams } from 'expo-router'

import { getAppointmentDetail } from '@/apis/appointment'
import ChevronLeftIcon from '@/assets/icons/chevron-left.svg'
import CopyIcon from '@/assets/icons/copy.svg'
import MoreIcon from '@/assets/icons/more.svg'
import PlusIcon from '@/assets/icons/plus.svg'
import AppointmentExpiredDetail from '@/components/AppointmentExpiredDetail'
import AppointmentNotSelectedDetail from '@/components/AppointmentNotSelectedDetail'
import AppointmentSelectedDetail from '@/components/AppointmentSelectedDetail'
import BackButton from '@/components/BackButton'
import KebabMenu from '@/components/KebabMenu'
import { RootState } from '@/store/store'
import { AppointmentDetailInfo } from '@/types/appointment'

// 한국어 설정
// LocaleConfig.locales['kr'] = {
//   monthNames: [
//     '1월',
//     '2월',
//     '3월',

//     '4월',
//     '5월',
//     '6월',
//     '7월',
//     '8월',
//     '9월',
//     '10월',
//     '11월',
//     '12월',
//   ],
//   monthNamesShort: [
//     '1월',
//     '2월',
//     '3월',
//     '4월',
//     '5월',
//     '6월',
//     '7월',
//     '8월',
//     '9월',
//     '10월',
//     '11월',
//     '12월',
//   ],
//   dayNames: [
//     '일요일',
//     '월요일',
//     '화요일',
//     '수요일',
//     '목요일',
//     '금요일',
//     '토요일',
//   ],
//   dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
// }
// LocaleConfig.defaultLocale = 'kr'
// type RouteParams = {
//   clubId: string
// }

export default function AppointmentDetail() {
  const { id, status } = useLocalSearchParams()
  const [appointmentDetail, setAppointmentDetail] =
    useState<AppointmentDetailInfo>()
  const [isKebabMenuVisible, setIsKebabMenuVisible] = useState(false)

  const { user } = useSelector((state: RootState) => state.member)
  const router = useRouter()

  // TODO: 호스트 여부 확인 (호스트 아이디와 유저 아이디 비교하고 싶은데 호스트 아이디가 없음, 참여자 아이디는 pk라 비교 불가)
  // TODO: 참여 여부 확인 (참여자 아이디와 유저 아이디 비교하고 싶은데 참여자 아이디는 pk라 비교 불가)
  // 아래 두 메서드는 participantId가 memberId와 같을 때 호스트 여부와 참여 여부를 확인할 수 있음
  // const isHost = user?.id === appointmentDetail?.appointmentInfo.hostId
  // const isAttending = appointmentDetail?.participantInfos.some(
  //   (participant) =>
  //     participant.participantId === user?.id && participant.isAttending,
  // )
  const isHost = true // 임시
  const isAttending = true // 임시

  useEffect(() => {
    const fetchAppointmentDetail = async () => {
      const data = await getAppointmentDetail(Number(id))
      setAppointmentDetail(data)
    }
    fetchAppointmentDetail()
  }, [])
  // console.log('id:', id)
  // console.log('status:', status)

  // const markedDates = {
  //   '2025-01-21': { marked: true, dotColor: '#ff8339' },
  //   '2025-01-22': { marked: true, dotColor: '#ff8339' },
  //   '2025-01-23': { marked: true, dotColor: '#ff8339' },
  //   '2025-01-24': { marked: true, dotColor: '#ff8339' },
  //   '2025-01-25': { marked: true, dotColor: '#ff8339' },
  // }

  console.log('🦖🦖 약속 상세 정보 : ', appointmentDetail)

  const handleEdit = () => {
    console.log('🦖🦖 약속 수정 페이지로 이동')
    router.push(
      `/appointment/update1?id=${appointmentDetail?.appointmentInfo.appointmentId}`,
    )
  }

  const handleDelete = () => {
    // TODO: 삭제 로직 구현
    console.log('약속 삭제')
  }

  const handleToggleParticipation = () => {
    // TODO: 참여/불참 토글 로직 구현
    console.log(isAttending ? '불참 처리' : '참여 처리')
  }

  return (
    <View className="flex-1 items-center justify-center">
      <View className="absolute top-0 right-0 p-4">
        <TouchableOpacity onPress={() => setIsKebabMenuVisible(true)}>
          <MoreIcon
            height={24}
            width={24}
          />
        </TouchableOpacity>
      </View>

      {appointmentDetail && (
        <KebabMenu
          isVisible={isKebabMenuVisible}
          onClose={() => setIsKebabMenuVisible(false)}
          isHost={isHost}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleParticipation={handleToggleParticipation}
          isAttending={isAttending}
        />
      )}

      <View className="flex-1 items-center justify-center">
        <Text className="text-lg font-bold mb-4">Appointment Detail</Text>
        <Text className="text-gray-500 mb-4">약속 ID: {id}</Text>
        <Text className="text-gray-500 mb-4">상태: {status}</Text>

        {/* 상태에 따라 다른 컴포넌트 렌더링 */}
        {status === 'EXPIRED' && appointmentDetail && (
          <AppointmentExpiredDetail appointmentDetail={appointmentDetail} />
        )}
        {status === 'SELECTED' && appointmentDetail && (
          <AppointmentSelectedDetail appointmentDetail={appointmentDetail} />
        )}
        {status === 'NOT_SELECTED' && appointmentDetail && (
          <AppointmentNotSelectedDetail appointmentDetail={appointmentDetail} />
        )}

        {/* 참여 인원 리스트 */}
        <View>
          <Text>
            참여 인원 :{' '}
            {
              appointmentDetail?.participantInfos.filter(
                (participant) => participant.isAttending,
              ).length
            }
          </Text>
          {appointmentDetail?.participantInfos
            .filter((participant) => participant.isAttending)
            .map((participant) => (
              <Text key={participant.participantId}>{participant.img}</Text>
            ))}
        </View>
      </View>
    </View>

    // <SafeAreaView className="flex-1 bg-white">
    //   {/* 헤더 */}
    //   <View className="flex-row p-4 border-b border-bord">
    //     <TouchableOpacity className="mr-4">
    //       <BackButton />
    //       <ChevronLeftIcon
    //         height={24}
    //         width={24}
    //       />
    //     </TouchableOpacity>
    //     <View className="flex-1">
    //       <Text className="text-xl font-bold">No.1</Text>
    //       <View className="flex-row items-center mt-1">
    //         <Text className="text-sm text-secondary">#스터디</Text>
    //         <Text className="text-sm text-secondary ml-2">2025-01-07 생성</Text>
    //       </View>
    //       <View className="flex-row items-center mt-1">
    //         <Text className="text-sm text-secondary">그룹 초대 코드</Text>
    //         <Text className="text-sm text-secondary mx-2">H9UF6K</Text>
    //         <TouchableOpacity>
    //           <CopyIcon
    //             height={20}
    //             width={20}
    //           />
    //         </TouchableOpacity>
    //       </View>
    //     </View>
    //     <TouchableOpacity className="p-2">
    //       <MoreIcon
    //         height={24}
    //         width={24}
    //       />
    //     </TouchableOpacity>
    //   </View>

    //   <ScrollView>
    //     {/* 멤버 리스트 */}
    //     <View className="p-4 border-b border-bord">
    //       <TouchableOpacity className="flex-row justify-between items-center p-3 border border-bord rounded-lg mb-4">
    //         <Text className="text-base">멤버 리스트</Text>
    //         <MoreIcon
    //           height={20}
    //           width={20}
    //         />
    //       </TouchableOpacity>
    //       <ScrollView
    //         horizontal
    //         showsHorizontalScrollIndicator={false}>
    //         <View className="flex-row">
    //           {Array.from({ length: 15 }).map((_, i) => (
    //             <View
    //               key={i}
    //               className="items-center mr-4">
    //               <View className="w-12 h-12 rounded-full bg-gray-200 mb-1" />
    //               <Text className="text-xs">멤버{i + 1}</Text>
    //             </View>
    //           ))}
    //         </View>
    //       </ScrollView>
    //     </View>

    //     {/* 캘린더 섹션 */}
    //     <View className="p-4">
    //       <Text className="text-lg font-bold mb-4">No.1 캘린더</Text>
    //       <Calendar
    //         className="border border-bord rounded-lg p-2"
    //         theme={{
    //           backgroundColor: '#ffffff',
    //           calendarBackground: '#ffffff',
    //           textSectionTitleColor: '#9c9c9c',
    //           selectedDayBackgroundColor: '#ff8339',
    //           selectedDayTextColor: '#ffffff',
    //           todayTextColor: '#ff8339',
    //           dayTextColor: '#1f1f1f',
    //           textDisabledColor: '#e6e6e6',
    //           dotColor: '#ff8339',
    //           selectedDotColor: '#ffffff',
    //           arrowColor: '#ff8339',
    //           monthTextColor: '#1f1f1f',
    //           textDayFontSize: 16,
    //           textMonthFontSize: 16,
    //           textDayHeaderFontSize: 14,
    //         }}
    //         markedDates={markedDates}
    //         markingType={'dot'}
    //         enableSwipeMonths={true}
    //         current={'2025-01-21'}
    //       />
    //     </View>

    //     {/* 스터디 목록 */}
    //     <View className="p-4 space-y-4">
    //       {Array.from({ length: 5 }).map((_, i) => (
    //         <TouchableOpacity
    //           key={i}
    //           className="flex-row p-4 border border-bord rounded-lg">
    //           <View className="w-12 h-12 rounded-lg bg-gray-200 mr-4" />
    //           <View className="flex-1">
    //             <Text className="font-bold">1월 {25 - i}일 스터디</Text>
    //             <Text className="text-sm text-secondary mt-1">오후 7:00</Text>
    //             <Text className="text-sm text-secondary">
    //               역삼 투썸플레이스 #스터디
    //             </Text>
    //           </View>
    //           <View className="items-end">
    //             <Text className="text-sm text-secondary mb-1">(6/6)</Text>
    //             <View className="bg-gray-100 px-3 py-1 rounded">
    //               <Text className="text-xs text-secondary">투표 종료</Text>
    //             </View>
    //           </View>
    //         </TouchableOpacity>
    //       ))}
    //     </View>
    //   </ScrollView>

    //   {/* 플로팅 버튼 */}
    //   <TouchableOpacity className="absolute right-4 bottom-8 w-14 h-14 rounded-full bg-primary items-center justify-center shadow-lg">
    //     <PlusIcon
    //       height={30}
    //       width={30}
    //       color="#fff"
    //     />
    //   </TouchableOpacity>
    // </SafeAreaView>
  )
}
