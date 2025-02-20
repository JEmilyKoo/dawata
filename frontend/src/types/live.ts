export interface AttendanceState {
  showArrived: boolean
  showNotArrived: boolean
  showAbsent: boolean
}

export interface LiveMember {
  memberId: number
  nickname: string
  img: string
  latitude: number
  longitude: number
  arrivalState: 'NOT_ARRIVED' | 'ARRIVED' | 'LATE' | 'ABSENT' | 'LOST'
  expectedArrivalTime: number
}

export interface WebSocketLiveRequest {
  memberId: number
  latitude: number
  longitude: number
}

export interface WebSocketLiveResponse {
  memberId: number
  latitude: number
  longitude: number
  arrivalState: 'NOT_ARRIVED' | 'ARRIVED' | 'LATE' | 'ABSENT' | 'LOST'
  estimatedTime: number
}

export interface CustomOverlay {
  id: number
  type: string
  latitude: number
  longitude: number
  fillColor: string
  strokeColor: string
  textColor?: string
  text?: string
  img?: string
  show: boolean
}

export interface LiveData {
  latitude: number
  longitude: number
  appointmentTime: string
  participants: LiveMember[]
}
