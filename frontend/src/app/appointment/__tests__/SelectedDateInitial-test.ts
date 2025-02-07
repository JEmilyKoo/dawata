import { describe, expect, test } from '@jest/globals'

import { AppointmentInfo } from '@/types/appointment'

import { getSelectedDate } from '../SelectedDateInitial'

const formatDate = (dateString: string) => dateString.split('T')[0] // YYYY-MM-DD 형식 변환

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
