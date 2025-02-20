import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { getClubMembers } from '@/apis/club'
import { RootState } from '@/store/store'
import { ClubMember } from '@/types/club'

interface UseClubMemberProps {
  clubId: number
  memberId?: number
}

export const useClubMember = ({ clubId, memberId }: UseClubMemberProps) => {
  const [isMember, setIsMember] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const { user } = useSelector((state: RootState) => state.member)

  const getTargetMember = (clubMembers: ClubMember[], id: number) => {
    if (!clubMembers) {
      return null
    }
    return clubMembers.find((member: ClubMember) => member.memberId === id)
  }

  useEffect(() => {
    const fetchClubMembers = async () => {
      const response = await getClubMembers({ clubId })
      if (!response) return
      const clubMembers: ClubMember[] = response.data
      const targetMember = getTargetMember(
        clubMembers,
        memberId ?? user.memberId,
      )
      if (targetMember) {
        setIsMember(true)
        if (targetMember.role === 0) {
          setIsAdmin(true)
        }
      } else {
        setIsMember(false)
        setIsAdmin(false)
      }
    }
    fetchClubMembers()
  }, [clubId, memberId])

  return { isMember, isAdmin }
}
