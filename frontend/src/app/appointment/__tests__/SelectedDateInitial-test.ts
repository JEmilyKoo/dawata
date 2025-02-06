import { describe, expect, test } from '@jest/globals'

import { AppointmentInfo } from '@/types/appointment'

const formatDate = (dateString: string) => dateString.split('T')[0] // YYYY-MM-DD 형식 변환

export function getSelectedDate(
  appointments: AppointmentInfo[],
): string | null {
  if (appointments.length === 0) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString()

  const futureAppointments = appointments.filter(
    (a) => new Date(a.scheduledAt) >= today,
  )
  const pastAppointments = appointments.filter(
    (a) => new Date(a.scheduledAt) < today,
  )

  if (
    futureAppointments.some(
      (a) => formatDate(a.scheduledAt) === formatDate(todayStr),
    )
  ) {
    return todayStr
  }

  if (futureAppointments.length > 0) {
    return futureAppointments.sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
    )[0].scheduledAt
  }

  return pastAppointments.sort(
    (a, b) =>
      new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime(),
  )[0].scheduledAt
}

describe('getSelectedDate function', () => {
  test('오늘 약속이 있는 경우 selectedDate는 오늘 날짜여야 한다', () => {
    const today = new Date()
    const appointments: AppointmentInfo[] = [
      {
        appointmentId: 1,
        scheduledAt: today.toISOString(),
        name: '오늘 약속',
        category: '미팅',
        voteEndTime: new Date().toISOString(),
      },
      {
        appointmentId: 2,
        scheduledAt: new Date(today.getTime() + 86400000).toISOString(),
        name: '내일 약속',
        category: '회의',
        voteEndTime: new Date().toISOString(),
      },
    ]

    const selectedDate = getSelectedDate(appointments)

    expect(formatDate(selectedDate!)).toEqual(formatDate(today.toISOString()))
  })

  test('오늘 약속이 없고, 미래의 약속이 있는 경우 가장 가까운 미래의 날짜가 selectedDate여야 한다', () => {
    const today = new Date()
    const futureDate = new Date(today.getTime() + 86400000 * 3) // 3일 후
    const appointments: AppointmentInfo[] = [
      {
        appointmentId: 1,
        scheduledAt: futureDate.toISOString(),
        name: '미래 약속',
        category: '워크샵',
        voteEndTime: new Date().toISOString(),
      },
    ]

    const selectedDate = getSelectedDate(appointments)

    expect(formatDate(selectedDate!)).toEqual(
      formatDate(futureDate.toISOString()),
    )
  })

  test('오늘과 미래의 약속이 없고, 과거의 약속만 있는 경우 가장 가까운 과거의 날짜가 selectedDate여야 한다', () => {
    const today = new Date()
    const pastDate = new Date(today.getTime() - 86400000 * 2) // 2일 전
    const appointments: AppointmentInfo[] = [
      {
        appointmentId: 1,
        scheduledAt: pastDate.toISOString(),
        name: '과거 약속',
        category: '이벤트',
        voteEndTime: new Date().toISOString(),
      },
    ]

    const selectedDate = getSelectedDate(appointments)

    expect(formatDate(selectedDate!)).toEqual(
      formatDate(pastDate.toISOString()),
    )
  })

  test('약속이 없는 경우 selectedDate는 null이어야 한다', () => {
    const appointments: AppointmentInfo[] = []

    const selectedDate = getSelectedDate(appointments)

    expect(selectedDate).toBeNull()
  })
})
