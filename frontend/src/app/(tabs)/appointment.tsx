import React, { useEffect, useState } from 'react'
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Calendar, LocaleConfig } from 'react-native-calendars'
import { useDispatch } from 'react-redux'

import {
  ActionSheetProps,
  useActionSheet,
} from '@expo/react-native-action-sheet'
import { useLocalSearchParams } from 'expo-router'
import { router } from 'expo-router'

import { getAppointments } from '@/apis/appointment'
import AppointmentCalendar from '@/app/appointment/components/AppointmentCalendar'
import AppointmentList from '@/app/appointment/components/AppointmentList'
import { getSelectedDate } from '@/app/appointment/hooks/SelectedDateInitial'
import AppointmentItem from '@/components/AppointmentItem'
import TopHeader from '@/components/TopHeader'
import { AppointmentListInfo } from '@/types/appointment'

LocaleConfig.defaultLocale = 'kr'

function Appointment() {
  const [appointments, setAppointments] = useState<AppointmentListInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string | null>(null) // ✅ selectedDate 추가

  const [markedDates, setMarkedDates] = useState<{ [key: string]: number[] }>(
    {},
  )

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAppointments({
          nextRange: 4,
          prevRange: 4,
          date: '2025-02',
        })
        setAppointments(data || [])
        setSelectedDate(
          getSelectedDate(
            data.map((a: AppointmentListInfo) => a.appointmentInfo),
          ),
        ) // ✅ 초기 selectedDate 설정
      } catch (error) {
        console.error('Failed to fetch appointments', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  useEffect(() => {
    if (appointments.length == 0) {
      return
    }
    let newMarkedDates: { [key: string]: number[] } = {}
    appointments.forEach((info) => {
      const dateKey = info.appointmentInfo.scheduledAt.split('T')[0] // "YYYY-MM-DD" 형식
      if (newMarkedDates[dateKey]) {
        if (newMarkedDates[dateKey].length > 3) {
          newMarkedDates[dateKey].push(info.clubInfo.clubId % 10)
        }
      } else {
        newMarkedDates[dateKey] = [info.clubInfo.clubId % 10]
      }
    })
    setMarkedDates(newMarkedDates)
  }, [appointments])
  interface Club {
    id: string
    name: string
    image: any
    tag: string
  }

  const dispatch = useDispatch()
  return (
    <SafeAreaView className="flex-1 bg-white">
      <TopHeader title="약속 모아보기" />
      <ScrollView>
        <AppointmentCalendar
          markedDates={markedDates}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
        <AppointmentList
          appointments={appointments}
          loading={loading}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Appointment
