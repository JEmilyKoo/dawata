import { useTranslation } from 'react-i18next'
import { Text, TouchableOpacity, View } from 'react-native'
import { useDispatch } from 'react-redux'

import { useRouter } from 'expo-router'

import ImageThumbnail from '@/components/ImageThumbnail'
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
  return (
    <TouchableOpacity
      onPress={handlePress}
      key={appointmentListInfo.appointmentInfo.appointmentId}
      className="flex-row justify-between items-center pb-4 rounded-xl mb-3">
      <ImageThumbnail
        img={appointmentListInfo.clubInfo.img}
        defaultImg={require('@/assets/clubs/club2.png')}
        className="rounded-xl"
        width={80}
        height={60}
      />

      <View className="flex-1 ml-2">
        <View className="flex-row justify-between content-end">
          <Text className="text-sm font-medium text-text-primary truncate">
            {appointmentListInfo.appointmentInfo.name}
          </Text>
          <Text className="text-text-primary text-xs pt-[1px]">
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
        <View className="flex-row justify-between">
          <Text className="text-sm text-text-secondary">
            장소투표중 #
            {t(`category.${appointmentListInfo.appointmentInfo.category}`)}
          </Text>
          <Text className="text-xs">
            {t(`voteStatus.${appointmentListInfo.voteStatus}`)}
          </Text>
          {/* 나중에 db 연결 확인하고 수정 예정 (voteStatus에 따라 투표 상태 보여주기) */}
        </View>
        <View className="flex-row space-x-1">
          {appointmentListInfo.participantInfos.map((participant, index) => (
            <ImageThumbnail
              key={index}
              img={participant.img}
              defaultImg={require('@/assets/avatars/user1.png')}
              className="rounded-full"
              width={24}
              height={24}
            />
          ))}
        </View>
      </View>
    </TouchableOpacity>
  )
}
