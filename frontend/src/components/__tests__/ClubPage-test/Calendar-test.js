import * as React from "react"
import { Calendar } from "react-native-calendars"

import { render } from "@testing-library/react-native"

const appointments = [
  { date: "2023-02-03", name: "2월 3일 스크럼" },
  { date: "2023-02-05", name: "중간발표" },
]

describe("Calendar component tests", () => {
  test("그룹 약속이 있는 날은 캘린더에 표시가 된다.", () => {
    const markedDates = appointments.reduce((acc, curr) => {
      acc[curr.date] = { marked: true, dotColor: "red" }
      return acc
    }, {})

    const { getByA11yLabel } = render(
      <Calendar
        markedDates={markedDates}
        testID="calendar"
      />,
    )

    appointments.forEach((appointment) => {
      expect(getByA11yLabel(`Calendar day ${appointment.date}`)).toHaveProp(
        "marking",
        { marked: true, dotColor: "red" },
      )
    })
  })
})
