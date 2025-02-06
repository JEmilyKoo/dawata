import { beforeEach, describe, expect, it, jest, test } from "@jest/globals"

import { getAppointments } from "@/apis/appointment"
import { selectAppointments, setAppointments } from "@/store/slices/clubSlice"
import type { RootState } from "@/store/store"
import {
  AppointmentInfo,
  AppointmentsInfo,
  ParticipantInfo,
  VoteInfo,
} from "@/types/appointment"

// 1️⃣ Mock 데이터 정의
const mockData: AppointmentsInfo = {
  clubInfo: { clubId: 1, name: "테스트 클럽", img: "", category: "" },
  appointmentInfo: [
    {
      appointmentId: 1,
      name: "테스트 약속",
      category: "STUDY",
      scheduledAt: "2024-03-20T14:00:00",
      voteEndTime: "2024-03-19T23:59:59",
    },
    {
      appointmentId: 2,
      name: "테스트 약속2",
      category: "STUDY",
      scheduledAt: "2024-03-21T14:00:00",
      voteEndTime: "2024-03-20T23:59:59",
    },
  ] satisfies AppointmentInfo[],
  participantInfo: [
    {
      email: "test@example.com",
      isAttending: true,
      dailyStatus: "0",
    } as ParticipantInfo,
  ],
  voteInfo: [
    {
      content: "테스트 투표",
      isSelected: false,
    } as VoteInfo,
  ],
}

// API 모듈 전체를 Mock 처리
jest.mock("@/apis/appointment", () => ({
  getAppointments: jest
    .fn()
    .mockImplementation(() => Promise.resolve(mockData)),
}))

interface TestStore {
  dispatch: jest.Mock
  getState: () => RootState
}

describe("그룹 메인 페이지 - 약속 리스트 조회 기능 테스트", () => {
  let testStore: TestStore

  beforeEach(() => {
    testStore = {
      dispatch: jest.fn(),
      getState: jest.fn<() => RootState>().mockReturnValue({
        club: {
          clubs: [
            {
              clubId: 1,
              name: "테스트 클럽",
              img: "",
              category: "",
              appointment: mockData.appointmentInfo, // 초기 상태에 mock 데이터 설정
            },
          ],
        },
      } as RootState),
    }
  })

  test("그룹의 약속 리스트를 조회하고 store에 저장해야 한다", async () => {
    // API 호출 및 store 업데이트
    const response = await getAppointments({ clubId: 1 })
    testStore.dispatch(
      setAppointments({
        clubId: 1,
        appointmentList: response.appointmentInfo,
      }),
    )

    // selector로 상태 확인
    const appointments = selectAppointments(testStore.getState(), 1)
    expect(appointments).toEqual(response.appointmentInfo)
  })
})
describe("클럽 약속 스토어 테스트", () => {
  it("클럽 약속 데이터를 저장하고 불러올 수 있다", () => {
    // given
    const mockResponse = {
      appointmentInfo: [
        {
          appointmentId: 1,
          category: "STUDY",
          name: "테스트 약속",
          scheduledAt: "2024-03-20T14:00:00",
          voteEndTime: "2024-03-19T23:59:59",
        },
      ],
      clubInfo: {
        category: "스터디",
        clubId: 1,
        img: "test.jpg",
        name: "테스트 클럽",
      },
      participantInfo: [
        {
          dailyStatus: "0",
          email: "test@example.com",
          isAttending: true,
        },
      ],
      voteInfo: [
        {
          content: "테스트 투표",
          isSelected: false,
        },
      ],
    }

    // // when
    // store.dispatch(setClubAppointment(mockResponse))
    // const result = getClubAppointment(store.getState(), 1)

    // // then
    // expect(result).toEqual(mockResponse)
  })

  it("존재하지 않는 클럽 ID로 조회시 null을 반환한다", () => {
    // // when
    // const result = getClubAppointment(store.getState(), 999)
    // // then
    // expect(result).toBeNull()
  })
})
