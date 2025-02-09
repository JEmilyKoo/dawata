export interface Appointment {
  appointmentName: string
  groupName: string
  scheduledAt: string
  voteEndTime: string
}

export interface AttendanceStatus {
  clubId: number // 그룹 pk id
  clubName: string // 그룹 이름
  totalCount: number // 총 약속 횟수
  appointmentTotalCount: number // 정상 참석
  lateTotalCount: number // 지각
  onTimeAttendanceTotalCount: number // 노쇼
}
