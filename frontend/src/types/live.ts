export interface AttendanceState {
  showArrived: boolean
  showNotArrived: boolean
  showAbsent: boolean
}

export interface LiveMember {
  id: number
  nickname: string
  img: any
  eta: string | null
  liveStatus: number
  latitude: number
  longitude: number
}
