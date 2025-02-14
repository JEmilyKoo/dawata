import { useEffect, useState } from 'react'

import { getAppointments } from '@/apis/appointment'
import { AppointmentListInfo } from '@/types/appointment'

export const useClubAppointments = ({
  clubId,
  date,
}: {
  clubId: number
  date: string
}) => {
  const [appointments, setAppointments] = useState<AppointmentListInfo[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const clubAppointmentsListWithRange = async () => {
      try {
        const result = await getAppointments({
          clubId,
          date: date,
        })
        if (result) {
          setAppointments(result.data)
        } else {
          console.log('🚫🚫🚫🚫result is null🚫🚫🚫🚫')
        }
        console.log(result)
      } catch (error) {
        console.error('Failed to fetch appointments', error)
      } finally {
        setLoading(false)
      }
    }

    clubAppointmentsListWithRange()
    // cleanup 함수가 필요하다면 여기서 반환
  }, [clubId, date])
  return {
    appointments,
    loading,
  }
}
