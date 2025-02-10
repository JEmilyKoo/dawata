import { useEffect, useState } from 'react'

import api from '@/apis/api'
import { getClubMembers } from '@/apis/club'
import { Club, ClubMember } from '@/types/club'

export const useClubMemberList = ({ clubId }: { clubId: number }) => {
  const [clubMemberList, setClubMemberList] = useState<ClubMember[]>([])

  useEffect(() => {
    const fetchClubMemberList = async () => {
      const response = await getClubMembers({ clubId: clubId })
      if (!response) {
        return
      }
      const clubMembers: ClubMember[] = response.data
      const filteredList = clubMembers.filter((member) => member.role === 1)
      setClubMemberList(filteredList)
    }
    fetchClubMemberList()
  }, [])
  return { clubMemberList }
}
