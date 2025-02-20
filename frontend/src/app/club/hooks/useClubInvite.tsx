import { useEffect, useState } from 'react'

import { searchMemberByEmail } from '@/apis/club'
import { SearchMemberByEmailResponse } from '@/types/club'

export const useClubInvite = () => {
  const [searchEmail, setSearchEmail] = useState('test@gmail.com')
  const [targetMember, setTargetMember] =
    useState<SearchMemberByEmailResponse | null>(null)

  useEffect(() => {
    const fetchClubMembers = async () => {
      setSearchEmail(searchEmail)
      const response = await searchMemberByEmail(searchEmail)
      if (response) {
        const targetMember: SearchMemberByEmailResponse = response.data
        setTargetMember(targetMember)
      } else {
        return null
      }
    }
    fetchClubMembers()
  }, [searchEmail])

  return { targetMember }
}

export default useClubInvite
