import { useState } from 'react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Calendar, LocaleConfig } from 'react-native-calendars'
import { Menu, MenuOptions, MenuTrigger } from 'react-native-popup-menu'
import { useSelector } from 'react-redux'

import { useRoute } from '@react-navigation/native'
import { useRouter } from 'expo-router'
import { useLocalSearchParams } from 'expo-router'

import {
  deleteAppointment,
  getAppointmentDetail,
  updateMyAppointmentAttendance,
} from '@/apis/appointment'
import AppointmentExpiredDetail from '@/app/appointment/components/AppointmentExpiredDetail'
import AppointmentNotSelectedDetail from '@/app/appointment/components/AppointmentNotSelectedDetail'
import AppointmentSelectedDetail from '@/app/appointment/components/AppointmentSelectedDetail'
import ChevronLeftIcon from '@/assets/icons/chevron-left.svg'
import CopyIcon from '@/assets/icons/copy.svg'
import MoreIcon from '@/assets/icons/more.svg'
import PlusIcon from '@/assets/icons/plus.svg'
import BackButton from '@/components/BackButton'
import DropDown from '@/components/DropDown'
import MenuCustomOptions from '@/components/MenuCustomOptions'
import Colors from '@/constants/Colors'
import { RootState } from '@/store/store'
import { AppointmentDetailInfo } from '@/types/appointment'
import { MenuItem } from '@/types/menu'

export default function AppointmentDetail() {
  const { t } = useTranslation()
  const { id } = useLocalSearchParams()
  const [appointmentDetail, setAppointmentDetail] =
    useState<AppointmentDetailInfo>()

  const { user } = useSelector((state: RootState) => state.member)
  const status = useSelector(
    (state: RootState) => state.appointment.currentVoteStatus,
  )
  const router = useRouter()

  // 호스트 여부 확인 : 참가자 정보들 중에 userId와 같은 memberId의 role 확인하여 호스트 여부 확인
  // 참여 여부 확인 : 참가자 정보들 중에 userId와 같은 memberId의 isAttending 확인
  const [isHost, setIsHost] = useState(
    appointmentDetail?.participantInfos.some(
      (participant) =>
        participant.memberId === user?.id && participant.role === 'HOST',
    ),
  )
  const [isAttending, setIsAttending] = useState(
    appointmentDetail?.participantInfos.some(
      (participant) =>
        participant.memberId === user?.id && participant.isAttending,
    ),
  )
  // const isHost = true // 임시
  // const isAttending = false // 임시

  useEffect(() => {
    const fetchAppointmentDetail = async () => {
      const data = await getAppointmentDetail(Number(id))
      setAppointmentDetail(data)
    }
    fetchAppointmentDetail()
  }, [isAttending, isHost])

  useEffect(() => {
    if (appointmentDetail) {
      console.log('appointmentDetail 있음')
      const attending = appointmentDetail.participantInfos.some(
        (participant) =>
          participant.memberId === user?.id && participant.isAttending,
      )
      console.log('참여 상태:', attending)
      setIsAttending(attending)
    } else {
      console.log('appointmentDetail이 아직 undefined임')
    }
  }, [appointmentDetail])

  useEffect(() => {
    if (appointmentDetail) {
      setIsHost(
        appointmentDetail.participantInfos.some(
          (participant) =>
            participant.memberId === user?.id && participant.role === 'HOST',
        ),
      )
    }
  }, [appointmentDetail])

  console.log('약속 상세 정보 : ', appointmentDetail)

  const handleEdit = () => {
    console.log('약속 수정 페이지로 이동')
    router.push(
      `/appointment/update1?id=${appointmentDetail?.appointmentInfo.appointmentId}`,
    )
  }

  const handleDelete = async () => {
    // TODO: 삭제 로직 구현
    console.log('id:', Number(id))
    const data = await deleteAppointment(Number(id))
    router.replace('/appointment')
    console.log('약속 삭제')
  }

  const handleToggleParticipation = async () => {
    // TODO: 참여/불참 토글 로직 구현
    if (isAttending !== undefined) {
      const data = await updateMyAppointmentAttendance(Number(id), {
        isAttending: !isAttending,
      })
      setIsAttending(!isAttending)
    }
  }
  const detailHostMenu = (isAttending: boolean) => {
    return [
      {
        title: !isAttending ? '참여' : '불참',
        onSelect: handleToggleParticipation,
        color: Colors.text.primary,
      },
      {
        title: '수정',
        onSelect: handleEdit,
        color: Colors.text.primary,
      },
      {
        title: '삭제',
        onSelect: handleDelete,
        color: Colors.light.red,
      },
    ]
  }

  const detailmemberMenu = (isAttending: boolean) => {
    return [
      {
        title: !isAttending ? '참여' : '불참',
        onSelect: handleToggleParticipation,
        color: Colors.text.primary,
      },
    ]
  }
  const [menu, setMenu] = useState<MenuItem[]>([])

  useEffect(() => {
    const menu: MenuItem[] = isHost
      ? detailHostMenu(isAttending ?? false)
      : detailmemberMenu(isAttending ?? false)
    setMenu(menu)
  }, [isHost, isAttending])

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text>{isAttending ? '참' : '불'}</Text>
      <View className="absolute top-0 right-0 p-4">
        <Menu>
          <MenuTrigger>
            <MoreIcon
              height={24}
              width={24}
            />
          </MenuTrigger>
          <MenuOptions>
            <MenuCustomOptions menuList={menu} />
          </MenuOptions>
        </Menu>
      </View>

      <View className="items-center justify-center w-full p-4">
        {/* <Button
          title="현재 참여 상태 확인용"
          onPress={handleCheckAttending}
        /> */}
        <Text className="text-lg font-bold mb-4">Appointment Detail</Text>
        <Text className="text-gray-500 mb-4">약속 ID: {id}</Text>
        <Text className="text-gray-500 mb-4">
          상태: {t(`voteStatus.${status}`)}
        </Text>
        <View className="flex-1 w-full">
          {/* 상태에 따라 다른 컴포넌트 렌더링 */}
          {status === 'EXPIRED' && appointmentDetail && (
            <AppointmentExpiredDetail appointmentDetail={appointmentDetail} />
          )}
          {status === 'SELECTED' && appointmentDetail && (
            <AppointmentSelectedDetail appointmentDetail={appointmentDetail} />
          )}
          {status === 'NOT_SELECTED' && appointmentDetail && (
            <AppointmentNotSelectedDetail
              appointmentDetail={appointmentDetail}
            />
          )}
        </View>
        {/* 참여 인원 리스트 */}
        <View className="w-full">
          <DropDown title="참여 인원">
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
          </DropDown>
        </View>
      </View>
    </View>
  )
}
