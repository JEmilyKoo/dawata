import { describe, expect, jest, test } from '@jest/globals'
import { render, waitFor } from '@testing-library/react-native'
import { fireEvent } from '@testing-library/react-native'

import AppointmentList from '../AppointmentList'

describe('AppointmentList', () => {
  test('약속이 하나라도 있는 경우 약속 리스트를 표시한다.', async () => {
    const appointments = [
      {
        clubInfo: {
          clubId: 1,
          name: 'club1',
          img: require('@/assets/avatars/user1.png'),
          category: 'FRIEND',
        },
        appointmentInfo: {
          appointmentId: 1,
          category: 'FRIEND',
          name: 'appointment1',
          scheduledAt: '2025-02-06T15:43:43',
          voteEndTime: '2025-02-06T15:43:58',
        },
        participantInfos: [
          {
            email: 'user1@example.com',
            isAttending: true,
            dailyStatus: '오늘 참여',
          },
        ],
      },
    ]

    jest
      .spyOn(require('@/apis/appointment'), 'getAppointments')
      .mockResolvedValue(appointments)

    const { getByText } = render(<AppointmentList />)

    await waitFor(() => {
      expect(getByText('appointment1')).toBeTruthy()
    })
  })

  test('약속이 없는 경우 빈 상태 메시지를 표시한다.', async () => {
    jest
      .spyOn(require('@/apis/appointment'), 'getAppointments')
      .mockResolvedValue([])

    const { getByText } = render(<AppointmentList />)

    await waitFor(() => {
      expect(getByText('예정된 약속이 없습니다.')).toBeTruthy()
    })
  })

  test('데이터 로딩 중에는 로딩 상태를 표시한다.', async () => {
    const loadingPromise = new Promise(() => {}) // 영원히 해결되지 않는 프로미스
    jest
      .spyOn(require('@/apis/appointment'), 'getAppointments')
      .mockReturnValue(loadingPromise)

    const { getByTestId } = render(<AppointmentList />)

    expect(getByTestId('loading-indicator')).toBeTruthy()
  })

  // test('리스트를 스크롤하면 selectedDate가 변경된다.', async () => {
  //   const appointments = [
  //     {
  //       clubInfo: {
  //         clubId: 1,
  //         name: 'club1',
  //         img: require('@/assets/avatars/user1.png'),
  //         category: 'FRIEND',
  //       },
  //       appointmentInfo: {
  //         appointmentId: 1,
  //         category: 'FRIEND',
  //         name: 'appointment1',
  //         scheduledAt: '2025-02-06T15:43:43',
  //         voteEndTime: '2025-02-06T15:43:58',
  //       },
  //       participantInfos: [
  //         {
  //           email: 'user1@example.com',
  //           isAttending: true,
  //           dailyStatus: '오늘 참여',
  //         },
  //       ],
  //     },
  //   ]

  //   jest
  //     .spyOn(require('@/apis/appointment'), 'getAppointments')
  //     .mockResolvedValue(appointments)

  //   const { getByTestId } = render(<AppointmentList />)

  //   // 초기 selectedDate 확인
  //   const initialDate = getByTestId('selected-date').props.children

  //   // 스크롤 이벤트 시뮬레이션
  //   fireEvent.scroll(getByTestId('appointment-list'), {
  //     nativeEvent: {
  //       contentOffset: { y: 100 },
  //       layoutMeasurement: { height: 100 },
  //       contentSize: { height: 1000 },
  //     },
  //   })

  //   // 스크롤 후 selectedDate가 변경되었는지 확인
  //   await waitFor(() => {
  //     const newDate = getByTestId('selected-date').props.children
  //     expect(newDate).not.toBe(initialDate)
  //     expect(newDate).toContain('2025-02-06')
  //   })
  // })
})
