import React from "react"

import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { fireEvent, render } from "@testing-library/react-native"

import GroupManagementPopup from "../components/GroupManagementPopup"

const Stack = createNativeStackNavigator()

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="GroupManagementPopup"
          component={GroupManagementPopup}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

describe("그룹 관리 팝업 상호작용", () => {
  it("케밥 아이콘 클릭 시 그룹 관리 팝업 표시", () => {
    const { getByTestId, getByText } = render(<App />)
    const kebabIcon = getByTestId("kebab-icon")
    fireEvent.press(kebabIcon)

    expect(getByText("그룹 관리")).toBeTruthy()
  })

  it("일반 회원은 그룹 정보 수정과 그룹 탈퇴만 가능", () => {
    const { getByTestId, queryByText } = render(<App memberType="regular" />)
    const kebabIcon = getByTestId("kebab-icon")
    fireEvent.press(kebabIcon)

    expect(queryByText("그룹 정보 수정")).toBeTruthy()
    expect(queryByText("그룹 탈퇴")).toBeTruthy()
    expect(queryByText("멤버 관리")).toBeNull()
    expect(queryByText("그룹 해산")).toBeNull()
  })

  it("관리자는 수정, 멤버 관리, 그룹 해산 가능", () => {
    const { getByTestId, queryByText } = render(<App memberType="admin" />)
    const kebabIcon = getByTestId("kebab-icon")
    fireEvent.press(kebabIcon)

    expect(queryByText("그룹 정보 수정")).toBeTruthy()
    expect(queryByText("멤버 관리")).toBeTruthy()
    expect(queryByText("그룹 해산")).toBeTruthy()
    expect(queryByText("그룹 탈퇴")).toBeNull() // 관리자는 그룹을 탈퇴할 수 없음
  })

  it("관리자는 그룹장 위임 후 탈퇴 가능", () => {
    const { getByTestId, queryByText } = render(<App memberType="admin" />)
    const kebabIcon = getByTestId("kebab-icon")
    fireEvent.press(kebabIcon)
    const exitButton = queryByText("그룹 탈퇴")

    fireEvent.press(exitButton) // 탈퇴 시도
    expect(
      queryByText("관리자 역할을 위임한 후에 탈퇴해야 합니다"),
    ).toBeTruthy()
  })
})
