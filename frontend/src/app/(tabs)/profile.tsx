import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'
import { Calendar, LocaleConfig } from 'react-native-calendars'

import ProfileHeader from '@/components/ProfileHeader'
import ProfileStats from '@/components/ProfileStats'
import {
  AttendanceStatusData,
  profileCalendarData,
} from '@/constants/profileData'

import { useAttendanceStatus } from '../profile/hooks/useAttendanceStatus'

LocaleConfig.locales['kr'] = {
  monthNames: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
}

LocaleConfig.defaultLocale = 'kr'
export default function Profile() {
  // const { attendanceStatus, loading } = useAttendanceStatus()

  const markedDates = {
    '2025-01-21': { marked: true, dotColor: '#ff8339' },
    '2025-01-22': { marked: true, dotColor: '#ff8339' },

    '2025-01-23': { marked: true, dotColor: '#ff8339' },
    '2025-01-24': { marked: true, dotColor: '#ff8339' },
    '2025-01-25': { marked: true, dotColor: '#ff8339' },
  }

  const { t } = useTranslation()
  return (
    <ScrollView>
      <ProfileHeader />
      <View className="p-4">
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
          current={'2025-01-21'}
        />
      </View>
      <ProfileStats attendanceStatus={AttendanceStatusData} />
    </ScrollView>
  )
}
