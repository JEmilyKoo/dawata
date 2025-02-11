import { useEffect } from 'react'

import { exchangeAdminRole } from '@/apis/club'

interface UseExchangeAdminRoleProps {
  clubId: number
  newAdminId: number
}

export const useExchangeAdminRole = ({
  clubId,
  newAdminId,
}: UseExchangeAdminRoleProps) => {
  useEffect(() => {
    const fetchAdminRole = async () => {
      const response = await exchangeAdminRole({ clubId, newAdminId })
      if (response?.status === 200) {
        //todo: 관리자 권한 위임 성공 후 로직 추가가
        console.log('관리자 권한 위임 성공')
      } else {
        //todo: 관리자 권한 위임 실패 후 로직 추가
        console.log('관리자 권한 위임 실패')
      }
    }
    fetchAdminRole()
  }, [clubId, newAdminId])
}
