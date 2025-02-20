import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

import AppointmentItem from '@/components/AppointmentItem'
import ImageThumbnail from '@/components/ImageThumbnail'
import { ClubInfo } from '@/types/clubAppointment'

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
  clubImg: string
}

const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  clubImg,
}) => {
  return (
    <View className="p-4 space-y-4">
      {appointments.map((appointment, index) => {
        const now = new Date()
        const voteEndTime = new Date(appointment.appointmentInfo.voteEndTime)
        const isVoteEnded = voteEndTime < now

        return (
          <AppointmentItem
            key={appointment.appointmentInfo.appointmentId}
            appointmentListInfo={appointment}
          />
        )
      })}
    </View>
  )
}

export default AppointmentList
