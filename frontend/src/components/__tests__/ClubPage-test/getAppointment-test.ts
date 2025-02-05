import * as React from "react"

import { describe, expect, test } from "@jest/globals"
import { jest } from "@jest/globals"
import axios from "axios"

import { getAppointmentByClubId } from "@/apis/appointment"
import {
  AppointmentInfo,
  AppointmentsInfo,
  ParticipantInfo,
  VoteInfo,
} from "@/types/appointment"

// API 모듈 전체를 Mock 처리
jest.mock("@/api/appointment", () => ({
  getAppointmentByClubId: jest.fn() as jest.Mock,
}))

describe("그룹 메인 페이지 접속 시, 그룹의 약속 리스트 조회 테스트", () => {
  test("그룹의 약속 리스트 조회 성공", async () => {
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

    // getAppointmentByClubId를 Mock으로 설정하여, 호출되면 mockData를 반환하도록 지정
    ;(getAppointmentByClubId as jest.Mock).mockResolvedValue(mockData)

    // 테스트 실행
    const response = await getAppointmentByClubId({ clubId: 1 })

    // getAppointmentByClubId가 정상적으로 호출되었는지 검증
    expect(getAppointmentByClubId).toHaveBeenCalledWith({ clubId: 1 })

    // 응답 데이터가 정상적으로 반환되었는지 확인
    expect(response).toEqual(mockData)
  })
})
