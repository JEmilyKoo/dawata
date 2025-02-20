import React from "react"

import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { fireEvent, render } from "@testing-library/react-native"

import AppointmentDetails from "../components/AppointmentDetails"
import AppointmentList from "../components/AppointmentList"

const Stack = createNativeStackNavigator()

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="AppointmentList"
          component={AppointmentList}
        />
        <Stack.Screen
          name="AppointmentDetails"
          component={AppointmentDetails}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

describe("그룹의 약속 리스트 네비게이션", () => {
  it("약속 리스트 아이템을 클릭하면 해당 약속 상세 페이지로 이동", () => {
    const { getByText, getByTestId } = render(<App />)

    // 약속 리스트 페이지를 렌더링
    const listItem = getByText("Meeting at 3 PM") // 테스트용 가상의 텍스트
    fireEvent.press(listItem) // 약속 아이템 클릭 시뮬레이션

    // 상세 페이지로의 이동을 확인
    expect(getByTestId("appointment-details-page")).toBeTruthy()
  })
})
