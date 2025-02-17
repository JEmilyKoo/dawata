import { useEffect, useState } from 'react'

import { AppointmentListInfo } from '@/types/appointment'
import { MarkedDates } from '@/types/profile'

interface UseMarkedDatesProps {
  appointments: AppointmentListInfo[]
  clubId: number
}

export const useMarkedDates = ({ appointments }: UseMarkedDatesProps) => {
  const [markedDates, setMarkedDates] = useState<MarkedDates>({})

  const setDotColor = (appointments: AppointmentListInfo) => {
    let color = '#A8A8A8'
    appointments.participantInfos.forEach((participant) => {
      switch (participant.dailyStatus) {
        case 'PRESENT':
          color = '#7CD992'
          break
        case 'LATE':
          color = '#F7E463'
          break
        case 'NO_SHOW':
          color = '#EB6060'
          break
      }
    })
    return color
  }

  const makeMarkedDates = (appointments: AppointmentListInfo[]) => {
    let newMarkedDates: MarkedDates = { ...markedDates }
    appointments.forEach((appointment: AppointmentListInfo) => {
      newMarkedDates[appointment.appointmentInfo.scheduledAt.split('T')[0]] = {
        marked: true,
        dotColor: setDotColor(appointment),
      }
    })
    setMarkedDates(newMarkedDates)
  }

  useEffect(() => {
    makeMarkedDates(appointments)
  }, [appointments])

  return { markedDates }
}

export default useMarkedDates
