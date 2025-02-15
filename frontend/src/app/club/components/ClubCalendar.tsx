import React from 'react'
import { Calendar } from 'react-native-calendars'

import { MarkedDates } from '@/types/profile'

interface ClubCalendarProps {
  markedDates: MarkedDates // 적절한 타입으로 교체해주세요.
  handleMonthChange: (changedMonth: { year: number; month: number }) => void
  currentMonth: string
}
const ClubCalendar: React.FC<ClubCalendarProps> = ({
  markedDates,
  handleMonthChange,
  currentMonth,
}) => {
  return (
    <Calendar
      className="border border-bord rounded-lg p-2"
      theme={{
        backgroundColor: '#ffffff',
        calendarBackground: '#ffffff',
        textSectionTitleColor: '#9c9c9c',
        selectedDayBackgroundColor: '#ff8339',
        selectedDayTextColor: '#ffffff',
        todayTextColor: '#ff8339',
        dayTextColor: '#1f1f1f',
        textDisabledColor: '#e6e6e6',
        dotColor: '#ff8339',
        selectedDotColor: '#ffffff',
        arrowColor: '#ff8339',
        monthTextColor: '#1f1f1f',
        textDayFontSize: 16,
        textMonthFontSize: 16,
        textDayHeaderFontSize: 14,
      }}
      markedDates={markedDates}
      markingType={'dot'}
      enableSwipeMonths={true}
      current={currentMonth}
      onMonthChange={handleMonthChange}
    />
  )
}

export default ClubCalendar
