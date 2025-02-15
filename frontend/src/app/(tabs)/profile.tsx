import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'
import { Calendar, LocaleConfig } from 'react-native-calendars'

import ProfileHeader from '@/app/profile/components/ProfileHeader'
import ProfileStats from '@/app/profile/components/ProfileStats'
import { AttendanceStatusData } from '@/constants/profileData'

import { useAttendanceStatus } from '../profile/hooks/useAttendanceStatus'
import { useMarkedDates } from '../profile/hooks/useMarkedDates'
import { useUserAppointment } from '../profile/hooks/useUserAppointment'

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
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(
    today.getFullYear() + '-' + (today.getMonth() + 1),
  )
  const { userAppointment } = useUserAppointment({ currentMonth: currentMonth })
  const { markedDates } = useMarkedDates({ userAppointment })

  const handleMonthChange = (changedMonth: { year: number; month: number }) => {
    const formattedMonth = `${changedMonth.year}-${String(changedMonth.month).padStart(2, '0')}`
    setCurrentMonth(formattedMonth)
  }

  const { attendanceStatus } = useAttendanceStatus()
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
          current={currentMonth}
          initialDate={currentMonth}
          onMonthChange={handleMonthChange}
        />
      </View>
      <ProfileStats attendanceStatus={attendanceStatus} />
    </ScrollView>
  )
}
