import { Image, Text, TouchableOpacity, View } from 'react-native'

import { useRouter } from 'expo-router'

import { AppointmentListInfo } from '@/types/appointment'

export default function AppointmentItem({
  appointmentListInfo,
  userImages,
}: {
  appointmentListInfo: AppointmentListInfo
  userImages: any
}) {
  const router = useRouter()
  const { voteStatus, appointmentInfo } = appointmentListInfo

  const handlePress = () => {
    router.push(
      `/appointment/detail?id=${appointmentInfo.appointmentId}&status=${voteStatus}`,
    )
  }
  return (
    <TouchableOpacity
      onPress={handlePress}
      key={appointmentListInfo.appointmentInfo.appointmentId}
      className="flex-row justify-between items-center pb-4 rounded-xl mb-3">
      <Image
        source={appointmentListInfo.clubInfo.img}
        className="w-6 h-6 rounded-xl mb-2"
      />
      <View className="flex-1 ml-2">
        <Text className="text-base font-medium mb-1">
          {appointmentListInfo.appointmentInfo.name}
        </Text>
        <Text className="text-sm text-gray-500 mb-2">
          장소투표중 #{`${appointmentListInfo.appointmentInfo.category} `}
        </Text>
        <View className="flex-row space-x-1">
          {appointmentListInfo.participantInfos.map((participant, index) => (
            <View
              key={index}
              className="w-6 h-6 rounded-full bg-gray-300 pr-2">
              <Image
                source={userImages[index]}
                style={{ width: 24, height: 24 }}
              />
            </View>
          ))}
        </View>
      </View>
      {/* {appointmentDetailInfo.voteInfo.some((vote) => vote.isSelected) && ( */}
      <View className="flex-column items-end">
        <Text className="text-text-primary text-xs">
          {appointmentListInfo.appointmentInfo.voteEndTime}
        </Text>
        <View className="px-3 py-1.5">
          <Text className="text-xs">{appointmentListInfo.voteStatus}</Text>
          {/* 나중에 db 연결 확인하고 수정 예정 (voteStatus에 따라 투표 상태 보여주기) */}
        </View>
      </View>

      {/* )} */}
    </TouchableOpacity>
  )
}
