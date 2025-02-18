import { useState } from 'react'

const useCurrentMonth = () => {
  const now = new Date()
  const [currentMonth, setCurrentMonth] = useState(
    `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`,
  )

  return [currentMonth, setCurrentMonth] as const
}

export default useCurrentMonth
