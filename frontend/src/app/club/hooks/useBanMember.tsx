import { useEffect } from 'react'

import { banMember } from '@/apis/club'

interface UseBanMemberProps {
  clubId: number
  memberId: number
}

export const useBanMember = ({ clubId, memberId }: UseBanMemberProps) => {
  useEffect(() => {
    const fetchMemberBan = async () => {
      const response = await banMember({ clubId, memberId })
      if (response) {
        //todo: 회원 추방 성공 후 로직 추가
        console.log('회원 추방 성공')
      } else {
        //todo: 회원 추방 실패 후 로직 추가
        console.log('회원 추방 실패')
      }
    }
    fetchMemberBan()
  }, [clubId, memberId])
}
