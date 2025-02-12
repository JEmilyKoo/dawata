import { useEffect, useState } from 'react'

import { getAttendanceStatus } from '@/apis/profile'
import { UserAttendanceStatus } from '@/types/profile'

export const useAttendanceStatus = () => {
  const [attendanceStatus, setAttendanceStatus] = useState<
    UserAttendanceStatus[]
  >([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAttendanceStatus()
      .then((response) => {
        if (response) {
          setAttendanceStatus(response.data)
        }
      })
      .catch((error) => {
        console.error('랜더링 중 출석 정보 불러오기 실패', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return { attendanceStatus, loading }
}
