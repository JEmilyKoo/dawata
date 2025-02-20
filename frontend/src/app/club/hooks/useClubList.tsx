import { useEffect, useState } from 'react'

import { getClubs } from '@/apis/club'
import { Club } from '@/types/club'

export const useClubList = () => {
  const [clubList, setClubList] = useState<Club[]>([])

  useEffect(() => {
    const fetchClubList = async () => {
      const response = await getClubs()
      if (response) {
        setClubList(response)
      }
    }
    fetchClubList()
  }, [])

  return { clubList }
}

export default useClubList
