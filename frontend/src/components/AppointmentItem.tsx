import { useTranslation } from 'react-i18next'
import { Text, TouchableOpacity, View } from 'react-native'
import { useDispatch } from 'react-redux'

import { useRouter } from 'expo-router'

import ImageThumbnail from '@/components/ImageThumbnail'
import Colors from '@/constants/Colors'
import { setCurrentVoteStatus } from '@/store/slices/appointmentSlice'
import { AppointmentListInfo } from '@/types/appointment'

export default function AppointmentItem({
  appointmentListInfo,
}: {
  appointmentListInfo: AppointmentListInfo
}) {
  const router = useRouter()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { voteStatus, appointmentInfo } = appointmentListInfo
  const handlePress = () => {
    dispatch(setCurrentVoteStatus(voteStatus))
    router.push({
      pathname: '/appointment/detail',
      params: {
        id: appointmentInfo.appointmentId,
      },
    })
  }
  const groupColor = () => {
    let groupColorNumber: number = appointmentListInfo.clubInfo.clubId
    groupColorNumber = groupColorNumber ? groupColorNumber % 10 : 1
    const key = `color${groupColorNumber}` as keyof typeof Colors.group
    return Colors.group[key]?.primary
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      key={appointmentListInfo.appointmentInfo.appointmentId}
      className="flex-1 relative flex-row justify-between items-center rounded-xl mb-4">
      <View className="justify-end absolute h-[60px] w-[80px] z-10">
        <View
          className="h-1/2 rounded-b-xl justify-center items-center"
          style={{ backgroundColor: 'rgba(127, 127, 127, 0.7)' }}>
          <Text className="w-3/4 text-center text-white font-medium text-[11px]  leading-4 opacity-100">
            {new Date(
              appointmentListInfo.appointmentInfo.scheduledAt,
            ).toLocaleString('ko', {
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })}
          </Text>
        </View>
      </View>
      <ImageThumbnail
        img={appointmentListInfo.clubInfo.img}
        defaultImg={require('@/assets/clubs/club2.png')}
        className="rounded-xl border border-bord"
        width={80}
        height={60}
      />
      <View
        className="h-full w-[3px] bg-light-red ml-1"
        style={{
          backgroundColor: groupColor(),
        }}></View>
      <View className="flex-1 ml-1 justify-between">
        <View className="flex-row justify-between content-end mb-1">
          <Text className="w-1/2 text-[13px] font-bold text-text-primary truncate pr-1 tracking-[-0.5px] ">
            {appointmentListInfo.appointmentInfo.name}
            {' • '}
            {appointmentListInfo.clubInfo.name}
          </Text>
          <View className="flex-row pt-[1px]">
            <Text className="font-bold text-text-secondary text-[10px] mr-1">
              투표 기한
            </Text>

            <Text className="font-regular text-text-secondary text-[10px] tracking-[-0.5px]">
              {new Date(
                appointmentListInfo.appointmentInfo.voteEndTime,
              ).toLocaleString('ko', {
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}
            </Text>
          </View>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-xs text-text-secondary">
            {appointmentListInfo.votePlace} #
            {t(`category.${appointmentListInfo.appointmentInfo.category}`)}
          </Text>
          <Text className="text-xs">
            {t(`voteStatus.${appointmentListInfo.voteStatus}`)}
          </Text>
          {/* 나중에 db 연결 확인하고 수정 예정 (voteStatus에 따라 투표 상태 보여주기) */}
        </View>
        <View className="flex-row">
          {appointmentListInfo.participantInfos.map((participant, index) => (
            <ImageThumbnail
              key={index}
              img={participant.img}
              defaultImg={require('@/assets/avatars/user1.png')}
              className="rounded-full mr-1"
              width={16}
              height={16}
            />
          ))}
        </View>
      </View>
    </TouchableOpacity>
  )
}
