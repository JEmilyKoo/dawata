export interface UserAppointment {
  appointmentName: string
  clubName: string
  scheduledAt: string
  voteEndTime: string
}

export interface UserAttendanceStatus {
  clubId: number // 그룹 pk id
  clubName: string // 그룹 이름
  totalCount: number // 총 약속 횟수
  appointmentTotalCount: number // 정상 참석
  lateTotalCount: number // 지각
  onTimeAttendanceTotalCount: number // 노쇼
}

export interface MarkedDate {
  marked: boolean
  dotColor: string
}

export interface MarkedDates {
  [date: string]: MarkedDate
}

// 내 출결 정보는 User를 붙인다.
// UserAppointment, UserAttendanceStatus
