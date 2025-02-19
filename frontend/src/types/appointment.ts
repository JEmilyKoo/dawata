import { CategoryGroupCodeTypes } from '@/constants/categoryGroupCode'

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
  memberId: number
  name: string
  isAttending: boolean
  dailyStatus: string
  role: string
  img: any
}

export interface VoteInfo {
  voteItemId: number
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
  votePlace: string
}

export interface AppointmentCreateInfo {
  name: string
  category: string
  scheduledAt: string
  voteEndTime: string
  clubId: number
  memberIds: number[]
}

export interface CreateVoteInfo {
  roadAddress: string
  longitude: number
  latitude: number
  title: string
  category: string
  linkUrl: string
}

interface Participant {
  memberId: number
  participantId: number
  nickname: string
  img: string
  latitude: number
  longitude: number
  duration: number
  paths: string[]
}

export interface LocationData {
  latitude: number
  longitude: number
  participantInfo: Participant[]
}

export interface RecommandApiResponse {
  status: string
  data: LocationData
}

export interface Standard {
  title: string
  latitude: number
  longitude: number
  standardId: number
}

export interface RecommandList {
  loading: number
  category_group_code: CategoryGroupCodeType
  recommand: Recommand[]
}

export interface StandardRecommand {
  standard: Standard
  recommandList: RecommandList[]
}

export interface Recommand {
  id: string
  place_name: string
  category_name: string
  category_group_code: CategoryGroupCodeType
  category_group_name: string
  phone: string
  address_name: string
  road_address_name: string
  x: string
  y: string
  place_url: string
  standardId?: number
}

export type CategoryGroupCodeType =
  (typeof CategoryGroupCodeTypes)[keyof typeof CategoryGroupCodeTypes]

//약속 조회로 받아온 데이터의 끝에는  Info를 붙인다.
//clubInfo, appointmentInfo, participantInfo, voteInfo
