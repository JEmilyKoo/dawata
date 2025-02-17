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
  img: string
  createDate: string
  members: ClubMember[]
}

export interface ClubHeaderProps {
  name: string
  category: string
  teamCode: string
  img: string
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

//club에서 가져온 데이터는 info를 붙이지 않는다. 대신 앞에 club을 붙인다. .

// Club  / ClubMember  :
