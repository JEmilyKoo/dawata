import { useEffect, useState } from 'react'

import { getAppointments } from '@/apis/appointment'
import { AppointmentListInfo } from '@/types/clubAppointment'

export const useClubAppointments = ({ clubId }: { clubId: number }) => {
  const [appointments, setAppointments] = useState<AppointmentListInfo[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const clubAppointmentsListWithRange = async () => {
      try {
        const data = await getAppointments({
          clubId,
          nextRange: 4,
          prevRange: 4,
        })
        setAppointments(data || [])
        console.log(data)
      } catch (error) {
        console.error('Failed to fetch appointments', error)
      } finally {
        setLoading(false)
      }
    }

    clubAppointmentsListWithRange()
    // cleanup 함수가 필요하다면 여기서 반환
  }, [clubId])
  return {
    appointments,
    loading,
  }
}
