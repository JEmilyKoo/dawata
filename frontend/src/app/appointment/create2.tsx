import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, Text, TouchableOpacity, View } from 'react-native'
import NativeDatePicker from 'react-native-date-picker'
import { useDispatch, useSelector } from 'react-redux'

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useRouter } from 'expo-router'

import WebDatePicker from '@/components/WebDatePicker'
import { RootState } from '@/store/store'

import {
  setCreateScheduledAt,
  setCreateVoteEndTime,
} from '../../store/slices/appointmentSlice'

const AppointmentCreate2 = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const router = useRouter()
  const { create } = useSelector((state: RootState) => state.appointment)
  const [date, setDate] = useState(
    create.scheduledAt ? new Date(create.scheduledAt) : new Date(),
  ) // 선택된 날짜 상태
  const [open, setOpen] = useState(true) // React Native DatePicker 열고 닫는 상태

  const handleConfirm = (date: Date) => {
    setDate(date) // 선택한 날짜를 상태로 업데이트
  }

  const onSubmit = () => {
    dispatch(setCreateScheduledAt(date.toISOString()))
    dispatch(
      setCreateVoteEndTime(
        new Date(date.setDate(date.getDate() - 1)).toISOString(),
      ),
    )
  }

  const onPressNext = () => {
    onSubmit()
    router.push('/appointment/create3')
  }
  const onPressPrev = () => {
    onSubmit()
    router.push('/appointment/create1')
  }

  return (
    <View className="flex-1 p-4">
      <Text className="text-xl font-bold mb-2">
        약속 날짜와 시간을 설정해주세요
      </Text>

      <TouchableOpacity
        className="p-2"
        onPress={() => setOpen(true)}>
        <Text className="text-white text-center">날짜와 시간 선택</Text>
      </TouchableOpacity>
      {Platform.OS === 'web' ? (
        <View className="w-full h-1/2 items-center">
          <WebDatePicker
            date={date}
            handleConfirm={handleConfirm}
          />
        </View>
      ) : (
        <NativeDatePicker
          modal
          open={open}
          date={date}
          onConfirm={handleConfirm}
          onCancel={() => setOpen(false)}
        />
      )}
      <Text className="mb-4">
        선택된 날짜와 시간: {format(date, 'PPP p', { locale: ko })}
      </Text>
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

export default AppointmentCreate2
