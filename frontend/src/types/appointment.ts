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
  email: string
  isAttending: boolean
  dailyStatus: string
}

export interface VoteInfo {
  content: string
  isSelected: boolean
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
