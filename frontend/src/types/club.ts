export interface ClubMember {
  id: number
  memberId: number
  clubId: number
  nickname: string
  clubName: string
  createdBy: number
}

export interface Club {
  id: number
  name: string
  category: string
  teamCode: string
  members: ClubMember[]
}
