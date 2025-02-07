import { useDispatch, useSelector } from 'react-redux'

import {
  toggleShowAbsent,
  toggleShowArrived,
  toggleShowNotArrived,
} from '@/store/slices/liveSlice'
import { RootState } from '@/store/store'

export const useAttendance = () => {
  const dispatch = useDispatch()
  const { attendanceState } = useSelector((state: RootState) => state.live)
  const { showArrived, showNotArrived, showAbsent } = attendanceState

  return {
    showArrived,
    showNotArrived,
    showAbsent,
    toggleShowArrived: () => dispatch(toggleShowArrived()),
    toggleShowNotArrived: () => dispatch(toggleShowNotArrived()),
    toggleShowAbsent: () => dispatch(toggleShowAbsent()),
  }
}
