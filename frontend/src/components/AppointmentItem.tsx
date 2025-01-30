import { Image, Text, TouchableOpacity, View } from "react-native"

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
export default function AppointmentItem({
  appointmentInfo,
  userImages,
}: {
  appointmentInfo: AppointmentsInfo
  userImages: any
}) {
  return (
    <TouchableOpacity
      key={appointmentInfo.appointmentInfo.appointmentId}
      className="flex-row justify-between items-center pb-4 rounded-xl mb-3">
      <Image
        source={appointmentInfo.clubInfo.img}
        className="w-6 h-6 rounded-xl mb-2"
      />
      <View className="flex-1 ml-2">
        <Text className="text-base font-medium mb-1">
          {appointmentInfo.appointmentInfo.name}
        </Text>
        <Text className="text-sm text-gray-500 mb-2">
          장소투표중 #{`${appointmentInfo.appointmentInfo.category} `}
        </Text>
        <View className="flex-row space-x-1">
          {appointmentInfo.participantInfo.map((participant, index) => (
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
      {appointmentInfo.voteInfo.some((vote) => vote.isSelected) && (
        <View className="flex-column items-end">
          <Text className="text-text-primary text-xs">
            {appointmentInfo.appointmentInfo.voteEndTime}
          </Text>
          <View className="px-3 py-1.5">
            <Text className="text-xs">✓ 투표 변경하기</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  )
}
