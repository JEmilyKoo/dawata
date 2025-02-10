export interface ClubMember {
  clubMemberId: number
  memberId: number
  clubId: number
  nickname: string
  clubName: string
  role: number
  email: string
  createdAt: string
  img: string
  name: string
}

export interface Club {
  clubId: number
  name: string
  category: string
  teamCode: string
  members: ClubMember[]
}

export interface ClubHeaderProps {
  name: string
  category: string
  teamCode: string
  clubId: number
}

export interface ClubMemberListProps {
  clubId: number
  members?: ClubMember[]
}

export interface ClubCalendarProps {
  markedDates: { [key: string]: { marked: boolean; dotColor: string } }
  currentDate: string
}

export interface ClubCreateInfo {
  name: string
  category: string
}

export interface SearchMemberByEmailResponse {
  id: number
  email: string
  name: string
  photoName: string
}
