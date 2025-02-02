import { afterEach, describe, expect, jest, test } from "@jest/globals"

import { Routine, Routines } from "@/types/routine"

import { Club, ClubMember } from "../../types/club"
import api from "../api"
import { createAppointment, getAppointments } from "../appointment"
import { getRoutines } from "../routine"
import axios from "axios"

jest.mock("axios") // api.ts를 목킹

describe("Routine API 테스트", () => {
  afterEach(() => {
    jest.clearAllMocks() // 매 테스트 후 Mock 초기화
  })

  // 루틴 리스트 조회
  test("getRoutines - 루틴 리스트 조회 요청 성공", async () => {
    const mockResponse: Routines = {
      content: [],
      pageable: "INSTANCE",
      size: 0,
      number: 0,
      sort: { empty: true, sorted: false, unsorted: true },
      numberOfElements: 0,
      first: true,
      last: true,
      empty: true,
    }
    const result = await getRoutines()
    expect(axios.get).toHaveBeenCalledWith("/routines")
    expect(result).toEqual(mockResponse)
  })

  // 루틴 생성

  // 특정 루틴 조회

  // 특정 루틴 수정

  // 특정 루틴 삭제

  // 약속 리스트 조회
  // test("getAppointments - 약속 리스트 조회 요청 성공", async () => {
  //   const mockResponse = {"status":"success","data":[]};
  //   (api.get as jest.Mock).mockResolvedValue(mockResponse)
  //   const result = await getAppointments({ clubId: 1 ,  nextRange : 4, prevRange : 4})
  //   expect(api.get).toHaveBeenCalledWith("/appointments", { params: { clubId: 1, nextRange: 4, prevRange: 4 } })
  //   expect(result).toEqual(mockResponse.data)
  // })

  // test("getAppointments - 약속 리스트 조회 요청 실패", async () => {
  //     const mockResponse = {"status":"success","data":[]};
  //     (api.get as jest.Mock).mockResolvedValue(mockResponse)
  //     const result = await getAppointments({ clubId: "fwekjrl23kjrlek" ,  nextRange : 4, prevRange : 4})
  //     expect(api.get).toHaveBeenCalledWith("/appointments", { params: { clubId: "fwekjrl23kjrlek", nextRange: 4, prevRange: 4 } })
  //     expect(result).toEqual(mockResponse.data)
  //   })

  /*   test('createClub - 클럽 생성 요청 성공', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: { id: 1, title: '새 클럽' } });
    const result = await createClub({ clubId: 1 });
    expect(api.get).toHaveBeenCalledWith('/appointments', { params: { clubId: 1, nextRange: 4, prevRange: 4 } });
    expect(result).toEqual([{ id: 1, title: '약속1' }, { id: 2, title: '약속2' }]);
  }); */

  //   test('getClub - 특정 클럽 데이터 요청 실패', async () => {
  //     (api.get as jest.Mock).mockRejectedValue(new Error('API 오류'));
  //     const result = await getClub({ clubId: 2 });
  //     expect(api.get).toHaveBeenCalledWith('/appointments', { params: { clubId: 2, nextRange: 4, prevRange: 4 } });
  //     expect(result).toBeNull();
  //   });

  // 전체 그룹 데이터 조회
  //   test("getClubs - 전체 그룹 데이터 요청 성공", async () => {
  //     // api가 status_data 구조가 아니라 BE 단에서 수정이 필요함
  //     const mockResponse: Club[] = [
  //       {
  //         id: 1,
  //         name: "testclub",
  //         category: "FRIEND",
  //         teamCode: "ABC123",
  //         members: [
  //           {
  //             id: 1,
  //             memberId: 1,
  //             clubId: 1,
  //             nickname: "Admin",
  //             clubName: "Test Club",
  //             createdBy: 0,
  //           },
  //           {
  //             id: 2,
  //             memberId: 2,
  //             clubId: 1,
  //             nickname: "User1",
  //             clubName: "Test Club",
  //             createdBy: 1,
  //           },
  //         ],
  //       },
  //     ]

  //     ;(api.get as jest.MockedFunction<typeof api.get>).mockResolvedValue(
  //       mockResponse,
  //     )
  //     const result = await getClubs()
  //     expect(api.get).toHaveBeenCalledWith("/clubs")
  //     expect(result).toEqual(mockResponse)
  //   })

  //   // 그룹 데이터 수정
  //   test('updateClub - 그룹 데이터 수정 요청 성공', async () => {
  //     (api.get as jest.Mock).mockResolvedValue({ data: { id: 1, title: '수정된 클럽' } });
  //     const result = await updateClub({ clubId: 1 });
  //     expect(api.get).toHaveBeenCalledWith('/appointments', { params: { clubId: 1, nextRange: 4, prevRange: 4 } });
  //     expect(result).toEqual({ id: 1, title: '수정된 클럽' });
  //   });

  //   test('deleteClub - 클럽 삭제 요청 성공', async () => {
  //     (api.get as jest.Mock).mockResolvedValue({});
  //     const result = await deleteClub({ clubId: 3 });
  //     expect(api.get).toHaveBeenCalledWith('/appointments', { params: { clubId: 3, nextRange: 4, prevRange: 4 } });
  //     expect(result).toEqual([{ id: 1, title: '약속1' }, { id: 2, title: '약속2' }]);
  //   });

  // 그룹 코드 조회
  //   test("getClubCode - 그룹 코드 조회 요청 성공", async () => {
  //     // api가 status_data 구조가 아니라 BE 단에서 수정이 필요함
  //     ;(api.get as jest.MockedFunction<typeof api.get>).mockResolvedValue(
  //       "ABC123",
  //     )
  //     const result = await getClubCode({ clubId: 1 })
  //     expect(api.get).toHaveBeenCalledWith(`/clubs/${1}/code`)
  //     expect(result).toEqual("ABC123")
  //   })

  //   test("getClubCode - 서버 오류로 실패", async () => {
  //     ;(api.get as jest.Mock).mockRejectedValue(
  //       new Error("Internal Server Error"),
  //     ) // ✅ 서버 오류 응답
  //     const result = await getClubCode({ clubId: 1 })
  //     expect(api.get).toHaveBeenCalledWith(`/clubs/1/code`)
  //     expect(result).toEqual(null)
  //   })

  // 클럽 멤버 전체 조회
  //   test("getClubMembers - 클럽 멤버 전체 조회 요청 성공", async () => {
  //     // api가 status_data 구조가 아니라 BE 단에서 수정이 필요함
  //     // 추후 BE에서 로그인하지 않은 사용자는 접근 불가능하게 수정 필요
  //     const mockResponse: ClubMember[] = [
  //       {
  //         id: 1,
  //         memberId: 1,
  //         clubId: 1,
  //         nickname: "Admin",
  //         clubName: "Test Club",
  //         createdBy: 0,
  //       },
  //       {
  //         id: 2,
  //         memberId: 2,
  //         clubId: 1,
  //         nickname: "User1",
  //         clubName: "Test Club",
  //         createdBy: 1,
  //       },
  //     ]
  //     ;(api.get as jest.MockedFunction<typeof api.get>).mockResolvedValue(
  //       mockResponse,
  //     )
  //     const result = await getClubMembers({ clubId: 1 })
  //     expect(api.get).toHaveBeenCalledWith(`/clubs/${1}/members`)
  //     expect(result).toEqual(mockResponse)
  //   })

  //   test("getClubMembers - 서버 오류로 실패", async () => {
  //     // 에러 코드 500을 추후 제공할 예정
  //     ;(api.get as jest.MockedFunction<typeof api.get>).mockRejectedValue(
  //       new Error("Internal Server Error"),
  //     )
  //     const result = await getClubMembers({ clubId: 1 })
  //     expect(api.get).toHaveBeenCalledWith(`/clubs/1/members`)
  //     expect(result).toEqual(null)
  //   })

  //   test("getClubMembers - 없는 clubId", async () => {
  //     // 에러 코드를 추후 제공할 예정
  //     ;(api.get as jest.MockedFunction<typeof api.get>).mockRejectedValue(null)
  //     const result = await getClubMembers({ clubId: 10001 })
  //     expect(api.get).toHaveBeenCalledWith(`/clubs/10001/members`)
  //     expect(result).toEqual(null)
  //   })
  // // 클럽 멤버 코드로 추가

  // test('addMemberByCode - 클럽 멤버 코드로 추가 요청 성공', async () => {
  //   (api.get as jest.Mock).mockResolvedValue({ data: { id: 1, title: '약속1' } });
  //   const result = await addMemberByCode({ clubId: 1 });
  //   expect(api.get).toHaveBeenCalledWith('/appointments', { params: { clubId: 1, nextRange: 4, prevRange: 4 } });
  //   expect(result).toEqual({ id: 1, title: '약속1' });
  // });

  // // 클럽 멤버 이메일로 추가
  // test('addMemberByEmail - 클럽 멤버 이메일로 추가 요청 성공', async () => {
  //   (api.get as jest.Mock).mockResolvedValue({ data: { id: 1, title: '약속1' } });
  //   const result = await addMemberByEmail({ clubId: 1 });
  //   expect(api.get).toHaveBeenCalledWith('/appointments', { params: { clubId: 1, nextRange: 4, prevRange: 4 } });
  //   expect(result).toEqual({ id: 1, title: '약속1' });
  // });

  // 그룹 내 특정 멤버 조회
  //   test("getClubMember - 그룹 내 특정 멤버 조회 요청 성공", async () => {
  //     // api가 status_data 구조가 아니라 BE 단에서 수정이 필요함
  //     const mockResponse: ClubMember = {
  //       id: 1,
  //       memberId: 1,
  //       clubId: 1,
  //       nickname: "Admin",
  //       clubName: "Test Club",
  //       createdBy: 0,
  //     }

  //     ;(api.get as jest.MockedFunction<typeof api.get>).mockResolvedValue(
  //       mockResponse,
  //     )
  //     const result = await getClubMember({ clubId: 1, clubMemberId: 1 })
  //     expect(api.get).toHaveBeenCalledWith(`/clubs/${1}/members/${1}`)
  //     expect(result).toEqual(mockResponse)
  //   })

  // // 멤버 정보 수정
  // test('updateClubMember - 멤버 정보 수정 요청 성공', async () => {
  //   (api.get as jest.Mock).mockResolvedValue({ data: { id: 1, title: '수정된 멤버' } });
  //   const result = await updateClubMember({ clubId: 1, clubMemberId: 1 });
  //   expect(api.get).toHaveBeenCalledWith('/appointments', { params: { clubId: 1, clubMemberId: 1, nextRange: 4, prevRange: 4 } });
  //   expect(result).toEqual({ id: 1, title: '수정된 멤버' });
  // });

  // // 그룹 회원 탈퇴
  // test('deleteClubMember - 그룹 회원 탈퇴 요청 성공', async () => {
  //   (api.get as jest.Mock).mockResolvedValue({ data: { id: 1, title: '약속1' } });
  //   const result = await deleteClubMember({ clubId: 1, clubMemberId: 1 });
  //   expect(api.get).toHaveBeenCalledWith('/appointments', { params: { clubId: 1, clubMemberId: 1, nextRange: 4, prevRange: 4 } });
  //   expect(result).toEqual({ id: 1, title: '약속1' });
  // });

  // // 특정 회원 강퇴
  // test('banMember - 그룹 멤버 강퇴 요청 성공', async () => {
  //   (api.get as jest.Mock).mockResolvedValue({ data: { id: 1, title: '약속1' } });
  //   const result = await banMember({ clubId: 1, adminId: 1, memberId: 1 });
  // });
})
