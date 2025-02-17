import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, Text, TouchableOpacity, View } from 'react-native'
import NativeDatePicker from 'react-native-date-picker'
import { useDispatch, useSelector } from 'react-redux'

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useRouter } from 'expo-router'

import { updateAppointment } from '@/apis/appointment'
import WebDatePicker from '@/components/WebDatePicker'
import { RootState } from '@/store/store'
import { AppointmentInfo } from '@/types/appointment'

import {
  setUpdateScheduledAt,
  setUpdateVoteEndTime,
} from '../../store/slices/appointmentSlice'

const AppointmentUpdate2 = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const router = useRouter()
  const { update } = useSelector((state: RootState) => state.appointment)

  const [date, setDate] = useState(
    update.scheduledAt ? new Date(update.scheduledAt) : new Date(),
  ) // 선택된 날짜 상태
  const [open, setOpen] = useState(true) // React Native DatePicker 열고 닫는 상태

  const minimumDate = () => {
    let today = new Date()
    today.setDate(today.getDate() - 1)
    return today
  }
  const handleConfirm = (date: Date) => {
    setDate(date) // 선택한 날짜를 상태로 업데이트
  }

  const onSubmit = async () => {
    dispatch(setUpdateScheduledAt(date.toISOString()))
    dispatch(
      setUpdateVoteEndTime(
        new Date(date.setDate(date.getDate() - 1)).toISOString(),
      ),
    )
  }

  const onPressNext = async () => {
    await onSubmit()
    if (await updateAppointment(update)) {
      router.push({
        pathname: '/appointment/detail',
        params: { id: update.appointmentId },
      })
    } else {
      console.log('오류 발생')
    }
  }
  const onPressPrev = () => {
    onSubmit()
    router.push('/appointment/update1')
  }

  return (
    <View className="flex-1 p-4 justify-between">
      <Text className="text-xl font-bold mb-2">
        약속 날짜와 시간을 설정해주세요
      </Text>

      {Platform.OS === 'web' ? (
        <View>
          <TouchableOpacity
            className="p-2 bg-primary"
            onPress={() => setOpen(true)}>
            <Text className="text-white text-center">날짜와 시간 선택</Text>
          </TouchableOpacity>
          <View className="w-full h-1/2 items-center">
            <WebDatePicker
              date={date}
              handleConfirm={handleConfirm}
            />
          </View>

          <Text className="mb-4">
            선택된 날짜와 시간: {format(date, 'PPP p', { locale: ko })}
          </Text>
        </View>
      ) : (
        <View className="bg-primary">
          <NativeDatePicker
            open={open}
            date={date}
            onDateChange={handleConfirm}
            minimumDate={minimumDate()}
            onCancel={() => setOpen(false)}
          />
        </View>
      )}
      <View className="flex-row justify-between space-x-2">
        <TouchableOpacity
          className="bg-bord p-2 rounded w-1/4"
          onPress={onPressPrev}>
          <Text className="text-text-primary text-center font-bold">
            {t('prev')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-primary p-2 rounded w-3/4"
          onPress={onPressNext}>
          <Text className="text-white text-center font-bold">{t('next')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default AppointmentUpdate2
