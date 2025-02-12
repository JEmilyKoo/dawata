import { useEffect, useState } from 'react'

import { MarkedDates, UserAppointment } from '@/types/profile'

interface UseMarkedDatesProps {
  userAppointment: UserAppointment[]
}

export const useMarkedDates = ({ userAppointment }: UseMarkedDatesProps) => {
  const [markedDates, setMarkedDates] = useState<MarkedDates>({})

  const makeMarkedDates = (userAppointment: UserAppointment[]) => {
    let newMarkedDates: MarkedDates = { ...markedDates }
    userAppointment.forEach((appointment) => {
      newMarkedDates[appointment.scheduledAt.split('T')[0]] = {
        marked: true,
        dotColor: '#ff8339',
      }
    })
    setMarkedDates(newMarkedDates)
  }

  useEffect(() => {
    makeMarkedDates(userAppointment)
  }, [userAppointment])

  return { markedDates }
}
