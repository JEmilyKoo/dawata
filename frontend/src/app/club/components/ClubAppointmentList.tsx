import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

interface Appointment {
  appointmentInfo: {
    appointmentId: number
    name: string
    category: string
    scheduledAt: string
    voteEndTime: string
  }
  participantInfos: {
    email: string
    isAttending: boolean
    dailyStatus: string
  }[]
}

interface AppointmentListProps {
  appointments: Appointment[]
  myClubs: {
    image: any
  }[]
}

const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  myClubs,
}) => {
  return (
    <View className="p-4 space-y-4">
      {appointments.map((appointment, index) => {
        const now = new Date()
        const voteEndTime = new Date(appointment.appointmentInfo.voteEndTime)
        const isVoteEnded = voteEndTime < now

        return (
          <TouchableOpacity
            key={index}
            className="flex-row p-4 border border-bord rounded-lg">
            <Image
              source={myClubs[0]?.image}
              className="w-12 h-12 rounded-lg bg-gray-200 mr-4"
            />
            <View className="flex-1">
              <Text className="font-bold">
                {appointment.appointmentInfo.name}
              </Text>
              <Text className="text-sm text-secondary mt-1">
                {new Date(
                  appointment.appointmentInfo.scheduledAt,
                ).toLocaleString()}
              </Text>
              <Text className="text-sm text-secondary">
                역삼 투썸플레이스 #스터디
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-sm text-secondary mb-1">
                참석 인원:{' '}
                {
                  appointment.participantInfos.filter((p) => p.isAttending)
                    .length
                }
                /{appointment.participantInfos.length}
              </Text>
              <View className="bg-gray-100 px-3 py-1 rounded">
                <Text className="text-xs text-secondary">
                  {isVoteEnded ? '투표 종료' : '투표 중'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

export default AppointmentList
