import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import NativeDatePicker from 'react-native-date-picker'
import { useDispatch, useSelector } from 'react-redux'

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useRouter } from 'expo-router'

import PrevNextButton from '@/components/PrevNextButton'
import StepIndicator from '@/components/StepIndicator'
import TopHeader from '@/components/TopHeader'
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
  )

  const [voteDate, setVoteDate] = useState(new Date(date))
  const minimumDate = () => {
    let today = new Date()
    today.setDate(today.getDate() - 1)
    return today
  }

  const handleConfirm = (date: Date) => {
    setDate(date) // 선택한 날짜를 상태로 업데이트
  }

  useEffect(() => {
    let vote = new Date(date)
    vote.setDate(vote.getDate() - 1)
    setVoteDate(vote)
  }, [date])

  const [next, setNext] = useState(false)
  const onSubmit = () => {
    dispatch(setCreateScheduledAt(date.toISOString()))
    dispatch(setCreateVoteEndTime(voteDate.toISOString()))
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
    <SafeAreaView className="flex-1 bg-white justify-between">
      <View className="flex-1 justify-start">
        <TopHeader title={t('createAppointment.title')} />
        <StepIndicator
          step={4}
          nowStep={2}
        />
        <Text className="text-text-primary text-xl font-bold p-5 mr-3">
          {t('createAppointment.date.title')}
        </Text>

        <View className="flex-1 justify-center items-center">
          {Platform.OS === 'web' ? (
            <View>
              <View className="w-full h-1/2 items-center">
                <WebDatePicker
                  date={date}
                  handleConfirm={handleConfirm}
                />
              </View>
            </View>
          ) : (
            <View className="bg-primary">
              <NativeDatePicker
                date={date}
                onDateChange={handleConfirm}
                minimumDate={minimumDate()}
              />
            </View>
          )}
          <View className="py-5 mb-4 w-3/4">
            {[
              { label: t('createAppointment.date.scheduledAt'), value: date },
              {
                label: t('createAppointment.date.voteEndTime'),
                value: voteDate,
              },
            ].map(({ label, value }) => (
              <View
                key={label}
                className="flex-row justify-between">
                <Text className="text-base font-medium text-text-primary">
                  {label}
                </Text>
                <Text className="text-base font-regular text-primary pl-1">
                  {value.toLocaleString('ko', {
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
      <PrevNextButton
        onPressPrev={onPressPrev}
        onPressNext={onPressNext}
      />
    </SafeAreaView>
  )
}

export default AppointmentCreate2
