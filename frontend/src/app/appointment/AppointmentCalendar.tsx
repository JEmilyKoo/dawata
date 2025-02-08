import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { Calendar } from 'react-native-calendars'

import colors from '@/constants/Colors'

export interface AppointmentCalendarProps {
  appointments: any
  markedDates: { [key: string]: number[] }
  onDateSelect?: (date: string) => void
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  appointments,
  markedDates,
  onDateSelect = () => {},
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

    // TODO: 약속 목록의 날짜를 다양하게 하고 그룹색 추가하여 약속이 있는 날짜에 그룹의 색이 나오도록 수정
    // -> 약속 메인 페이지 목록과 같은 데이터를 가져왔을 경우 그룹색을 clubId %10으로 임시 지정
    
  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString)
    onDateSelect(day.dateString)
  }

  return (
    <View className="p-4">
      <Text
        testID="selected-date"
        className="text-lg font-bold mb-2">
        선택된 날짜: {selectedDate || '없음'}
      </Text>
      <Calendar
        theme={{
          dayTextColor: colors.text.primary,
          textDisabledColor: colors.text.secondary,
          arrowColor: colors.primary,
        }}
        testID="calendar"
        markingType="multi-period"
        className="border border-border rounded-lg p-2"
        enableSwipeMonths={true}
        current={selectedDate || '2025-02-21'}
        onDayPress={handleDayPress} // ✅ 날짜 클릭 시 selectedDate 변경
        dayComponent={({ date, state }: { date: any; state: any }) => {
          const formattedDate = date.dateString // YYYY-MM-DD 형식
          return (
            <View>
              <TouchableOpacity
                testID={`date-${formattedDate}`} // ✅ 개별 날짜에 testID 추가
                onPress={() => handleDayPress({ dateString: formattedDate })}
                style={{
                  backgroundColor:
                    selectedDate === formattedDate
                      ? colors.primary
                      : 'transparent',
                  padding: 10,
                  borderRadius: 5,
                  width: '2.25rem',
                  height: '2.375rem',
                }}>
                <Text
                  className="text-center"
                  style={{ color: state === 'disabled' ? 'gray' : 'black' }}>
                  {date.day}
                </Text>
              </TouchableOpacity>
              <View className="justify-center">
                {markedDates[formattedDate] &&
                  markedDates[formattedDate].map(
                    (groupColor: number, index: number) =>
                      groupColor && (
                        <View
                          style={{
                            backgroundColor:
                              colors.group[`color${String(groupColor || 1)}`]
                                ?.primary,
                            marginBottom: '1px',
                          }}
                          className={'justify-center w-9 h-1 rounded-full'}
                          key={index}></View>
                      ),
                  )}
              </View>
            </View>
          )
        }}
      />
    </View>
  )
}

export default AppointmentCalendar
