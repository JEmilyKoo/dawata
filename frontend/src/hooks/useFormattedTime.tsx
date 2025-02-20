import { useMemo } from 'react'

const useFormattedTime = (seconds: number) =>
  useMemo(() => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours ? `${hours}시간 ` : ''}${minutes}분`
  }, [seconds])

export default useFormattedTime
