import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { Calendar } from 'react-native-calendars'

import { AppointmentInfo } from '@/types/appointment'

export interface AppointmentCalendarProps {
  appointments: AppointmentInfo[]
  onDateSelect?: (date: string) => void
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  appointments,
  onDateSelect = () => {},
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({})

  useEffect(() => {
    // ✅ markedDates 설정
    // TODO: 약속 목록의 날짜를 다양하게 하고 그룹색 추가하여 약속이 있는 날짜에 그룹의 색이 나오도록 수정
    const newMarkedDates: { [key: string]: any } = {}
    appointments.forEach((appointment) => {
      const dateKey = appointment.scheduledAt.split('T')[0] // "YYYY-MM-DD" 형식
      newMarkedDates[dateKey] = {
        marked: true,
        dotColor: '#ff8339', // 기본 색상
      }
    })
    setMarkedDates(newMarkedDates)
  }, [appointments])

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString)
    onDateSelect(day.dateString)
  }

  return (
    <View className="p-4">
      {/* ✅ 현재 선택된 날짜 표시 */}
      <Text
        testID="selected-date"
        className="text-lg font-bold mb-2">
        선택된 날짜: {selectedDate || '없음'}
      </Text>

      <Calendar
        testID="calendar"
        className="border border-border rounded-lg p-2"
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
        current={selectedDate || '2025-01-21'}
        onDayPress={handleDayPress} // ✅ 날짜 클릭 시 selectedDate 변경
        dayComponent={({ date, state }: { date: any; state: any }) => {
          const formattedDate = date.dateString // YYYY-MM-DD 형식
          return (
            <TouchableOpacity
              testID={`date-${formattedDate}`} // ✅ 개별 날짜에 testID 추가
              onPress={() => handleDayPress({ dateString: formattedDate })}
              style={{
                backgroundColor:
                  selectedDate === formattedDate ? '#ff8339' : 'transparent',
                padding: 10,
                borderRadius: 5,
              }}>
              <Text style={{ color: state === 'disabled' ? 'gray' : 'black' }}>
                {date.day}
              </Text>
            </TouchableOpacity>
          )
        }}
      />
    </View>
  )
}

export default AppointmentCalendar
