import { useEffect, useState } from 'react'

import { getUserAppointment } from '@/apis/profile'
import { UserAppointment } from '@/types/profile'

// 해당 월의 약속 정보
export const useUserAppointment = ({
  currentMonth,
}: {
  currentMonth: string
}) => {
  const [userAppointment, setUserAppointment] = useState<UserAppointment[]>([])

  useEffect(() => {
    getUserAppointment({ date: currentMonth })
      .then((response) => {
        if (response) {
          setUserAppointment(response.data)
        }
      })
      .catch((error) => {
        console.error('랜더링 중 출석 정보 불러오기 실패', error)
      })
  }, [currentMonth])

  return { userAppointment }
}

export default useUserAppointment
