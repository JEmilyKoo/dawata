import { describe, expect, test } from '@jest/globals'

interface AppointmentInfo {
  appointmentId: number
  scheduledAt: Date
  name: string
  category: string
  voteEndTime: Date
  createdBy: string
}

const formatDate = (date: Date) => date.toISOString().split('T')[0] // YYYY-MM-DD 형식 변환

export function getSelectedDate(appointments: AppointmentInfo[]): Date | null {
  if (appointments.length === 0) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const futureAppointments = appointments.filter((a) => a.scheduledAt >= today)
  const pastAppointments = appointments.filter((a) => a.scheduledAt < today)

  if (
    futureAppointments.some(
      (a) => formatDate(a.scheduledAt) === formatDate(today),
    )
  ) {
    return today
  }

  if (futureAppointments.length > 0) {
    return futureAppointments.sort(
      (a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime(),
    )[0].scheduledAt
  }

  return pastAppointments.sort(
    (a, b) => b.scheduledAt.getTime() - a.scheduledAt.getTime(),
  )[0].scheduledAt
}

describe('getSelectedDate function', () => {
  test('오늘 약속이 있는 경우 selectedDate는 오늘 날짜여야 한다', () => {
    const today = new Date()
    const appointments: AppointmentInfo[] = [
      {
        appointmentId: 1,
        scheduledAt: today,
        name: '오늘 약속',
        category: '미팅',
        voteEndTime: new Date(),
        createdBy: 'user1',
      },
      {
        appointmentId: 2,
        scheduledAt: new Date(today.getTime() + 86400000),
        name: '내일 약속',
        category: '회의',
        voteEndTime: new Date(),
        createdBy: 'user2',
      },
    ]

    const selectedDate = getSelectedDate(appointments)

    expect(formatDate(selectedDate!)).toEqual(formatDate(today))
  })

  test('오늘 약속이 없고, 미래의 약속이 있는 경우 가장 가까운 미래의 날짜가 selectedDate여야 한다', () => {
    const today = new Date()
    const futureDate = new Date(today.getTime() + 86400000 * 3) // 3일 후
    const appointments: AppointmentInfo[] = [
      {
        appointmentId: 1,
        scheduledAt: futureDate,
        name: '미래 약속',
        category: '워크샵',
        voteEndTime: new Date(),
        createdBy: 'user3',
      },
    ]

    const selectedDate = getSelectedDate(appointments)

    expect(formatDate(selectedDate!)).toEqual(formatDate(futureDate))
  })

  test('오늘과 미래의 약속이 없고, 과거의 약속만 있는 경우 가장 가까운 과거의 날짜가 selectedDate여야 한다', () => {
    const today = new Date()
    const pastDate = new Date(today.getTime() - 86400000 * 2) // 2일 전
    const appointments: AppointmentInfo[] = [
      {
        appointmentId: 1,
        scheduledAt: pastDate,
        name: '과거 약속',
        category: '이벤트',
        voteEndTime: new Date(),
        createdBy: 'user4',
      },
    ]

    const selectedDate = getSelectedDate(appointments)

    expect(formatDate(selectedDate!)).toEqual(formatDate(pastDate))
  })

  test('약속이 없는 경우 selectedDate는 null이어야 한다', () => {
    const appointments: AppointmentInfo[] = []

    const selectedDate = getSelectedDate(appointments)

    expect(selectedDate).toBeNull()
  })
})
