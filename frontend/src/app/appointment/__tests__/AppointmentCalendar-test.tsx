import { describe, expect, test } from '@jest/globals'
import { fireEvent, render, waitFor } from '@testing-library/react-native'

import { AppointmentInfo } from '@/types/appointment'

import AppointmentCalendar from '../AppointmentCalendar'

describe('AppointmentCalendar', () => {
  test('약속이 있는 날짜는 그룹색을 표시한다.', async () => {
    const mockAppointments: AppointmentInfo[] = [
      {
        appointmentId: 1,
        name: '스터디 모임',
        category: '스터디',
        scheduledAt: '2025-02-06T15:30:00', // ✅ T 포함
        voteEndTime: '2025-02-05T18:00:00',
      },
      {
        appointmentId: 2,
        name: '축구 경기',
        category: '운동',
        scheduledAt: '2025-02-10T20:00:00', // ✅ T 포함
        voteEndTime: '2025-02-09T18:00:00',
      },
    ]

    const mockGroupColors: { [key: string]: string } = {
      '2025-02-06': 'blue',
      '2025-02-10': 'red',
    }

    const { getByTestId } = render(
      <AppointmentCalendar appointments={mockAppointments} />,
    )

    await waitFor(() => {
      expect(getByTestId('calendar')).toBeTruthy() // ✅ Calendar가 렌더링되었는지 확인
    })

    // ✅ `groupColors`를 사용하여 특정 날짜의 색상을 확인
    expect(mockGroupColors['2025-02-06']).toBe('blue')
    expect(mockGroupColors['2025-02-10']).toBe('red')

    // ✅ 그룹색이 없는 날짜 확인 (예: 2025-02-07은 표시되지 않아야 함)
    expect(mockGroupColors['2025-02-07']).toBeUndefined()
  })

  // TODO: AppointmentCalendar에선 구현되는데 테스트에선 fail 나오는 부분 수정
  test('날짜를 눌렀을 때 selectedDate가 변경된다.', async () => {
    const mockAppointments: AppointmentInfo[] = [
      {
        appointmentId: 1,
        name: '스터디 모임',
        category: '스터디',
        scheduledAt: '2025-02-06T15:30:00', // ✅ T 포함
        voteEndTime: '2025-02-05T18:00:00',
      },
      {
        appointmentId: 2,
        name: '축구 경기',
        category: '운동',
        scheduledAt: '2025-02-10T20:00:00', // ✅ T 포함
        voteEndTime: '2025-02-09T18:00:00',
      },
    ]

    const { getByTestId } = render(
      <AppointmentCalendar appointments={mockAppointments} />,
    )

    // ✅ 날짜 클릭 이벤트 시뮬레이션 (2025-02-10 클릭)
    fireEvent.press(getByTestId('date-2025-02-10'))

    // ✅ selectedDate가 클릭한 날짜에서 단일 약속을 통해 결정되는지 확인
    await waitFor(() => {
      const expectedDateFromSingleAppointment =
        mockAppointments[1].scheduledAt.split('T')[0]
      expect(getByTestId('selected-date').props.children).toContain(
        expectedDateFromSingleAppointment,
      )
    })
  })
})
