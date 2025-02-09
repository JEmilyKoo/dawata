export interface ClubInfo {
  clubId: number
  name: string
  img: any
  category: string
}

export interface AppointmentInfo {
  appointmentId: number
  name: string
  category: string
  scheduledAt: string
  voteEndTime: string
}

export interface ParticipantInfo {
  participantId: number
  isAttending: boolean
  dailyStatus: string
  role: string
  img: any
}

export interface VoteInfo {
  title: string
  category: string
  detail: string
  linkUrl: string
  roadAddress: string
  latitude: number
  longitude: number
  isSelected: boolean
  percentage: number
}

export interface AppointmentDetailInfo {
  clubInfo: ClubInfo
  appointmentInfo: AppointmentInfo
  participantInfos: ParticipantInfo[]
  voteInfos: VoteInfo[]
}

export interface AppointmentListInfo {
  clubInfo: ClubInfo
  appointmentInfo: AppointmentInfo
  participantInfos: ParticipantInfo[]
  voteStatus: string
}

export interface AppointmentCreateInfo {
  name: string
  category: string
  scheduledAt: string
  voteEndTime: string
  clubId: number
  memberIds: number[]
}
