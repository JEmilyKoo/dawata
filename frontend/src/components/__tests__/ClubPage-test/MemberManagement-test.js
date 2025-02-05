import React from "react"

import { fireEvent, render } from "@testing-library/react-native"

import MemberList from "../components/MemberList"

const members = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    profilePicUrl: "https://example.com/profiles/john",
    isAdmin: false,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    profilePicUrl: "https://example.com/profiles/jane",
    isAdmin: true,
  },
]

describe("Member List Interactions", () => {
  test("멤버 리스트 아이템을 클릭하면, 해당 멤버의 프로필 정보가 담긴 팝업이 뜬다", () => {
    const { getByText, queryByText } = render(<MemberList members={members} />)

    fireEvent.press(getByText("John Doe"))

    expect(getByText("John Doe")).toBeTruthy()
    expect(getByText("john@example.com")).toBeTruthy()
    expect(queryByText("Profile Picture")).toBeTruthy()

    fireEvent.press(getByText("Jane Smith"))

    expect(queryByText("추방")).toBeTruthy()
    expect(queryByText("관리자 위임")).toBeTruthy()
  })
})

describe("관리자의 그룹 멤버 관리 기능", () => {
  it("관리자는 멤버를 추방, 그룹장을 위임하고, 멤버를 초대할 수 있다", () => {
    const { getByText, queryByText } = render(
      <MemberManagement
        members={members}
        adminId={2}
      />,
    )

    // 관리자 계정으로 팝업 표시 시뮬레이션
    fireEvent.press(getByText("Jane Smith"))

    // 관리자 권한 확인
    expect(getByText("멤버 추방")).toBeTruthy()
    expect(getByText("그룹장 위임")).toBeTruthy()
    expect(getByText("멤버 초대")).toBeTruthy()

    // 멤버 추방
    fireEvent.press(getByText("멤버 추방"))
    expect(queryByText("멤버가 추방되었습니다")).toBeTruthy()

    // 그룹장 위임
    fireEvent.press(getByText("그룹장 위임"))
    expect(queryByText("그룹장이 위임되었습니다")).toBeTruthy()

    // 멤버 초대
    fireEvent.press(getByText("멤버 초대"))
    expect(queryByText("멤버가 초대되었습니다")).toBeTruthy()
  })

  it("멤버 관리 페이지에는 본인(관리자)이 나오지 않는다", () => {
    const { queryByText } = render(
      <MemberManagement
        members={members}
        adminId={2}
      />,
    )

    // 관리자 본인이 목록에서 보이지 않는지 확인
    expect(queryByText("Jane Smith")).toBeNull()
  })
})
