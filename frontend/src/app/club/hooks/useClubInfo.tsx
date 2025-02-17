import { useEffect, useState } from 'react'

import api from '@/apis/api'
import { Club } from '@/types/club'

export const useClub = ({ clubId }: { clubId: number }) => {
  const [clubInfo, setClubInfo] = useState<Club>()
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const getClubInfoByClubId = async ({ clubId }: { clubId: number }) => {
      try {
        const response = await api.get(`/clubs/${clubId}`)
        setClubInfo(response.data)
      } catch (error) {
        console.error('⛔ 특정 그룹 데이터 조회 실패:', error)
        return null
      } finally {
        setLoading(false)
      }
    }
    getClubInfoByClubId({ clubId })
  }, [])
  return {
    clubInfo,
    loading,
  }
}

export default useClub
