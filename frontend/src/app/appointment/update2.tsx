import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, SafeAreaView, Text, View } from 'react-native'
import NativeDatePicker from 'react-native-date-picker'
import { useDispatch, useSelector } from 'react-redux'

import { useRouter } from 'expo-router'

import { updateAppointment } from '@/apis/appointment'
import PrevNextButton from '@/components/PrevNextButton'
import StepIndicator from '@/components/StepIndicator'
import TopHeader from '@/components/TopHeader'
import WebDatePicker from '@/components/WebDatePicker'
import { RootState } from '@/store/store'

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
    update.scheduledAt
      ? new Date(
          new Date(update.scheduledAt).getTime() + (24 * 60 + 60) * 60 * 1000,
        )
      : new Date(Date.now() + (24 * 60 + 60) * 60 * 1000),
  )

  const [voteDate, setVoteDate] = useState(new Date(date))
  const minimumDate = () => {
    let today = new Date()
    today.setDate(today.getDate() - 1)
    return today
  }
  const handleConfirm = (date: Date) => {
    setDate(date)
  }

  useEffect(() => {
    let vote = new Date(date)
    vote.setDate(vote.getDate() - 1)
    setVoteDate(vote)
  }, [date])

  const [next, setNext] = useState(false)

  const onPressNext = async () => {
    dispatch(setUpdateScheduledAt(date.toISOString()))
    dispatch(setUpdateVoteEndTime(voteDate.toISOString()))
  }

  const updateAppo = async () => {
    if (await updateAppointment(update)) {
      router.push({
        pathname: '/appointment/detail',
        params: { id: update.appointmentId },
      })
    } else {
      console.log('오류 발생')
    }
  }
  const isFirstRender = useRef(true)

  const isUpdating = useRef(false)

  useEffect(() => {
    if (next && !isUpdating.current) {
      isUpdating.current = true
      updateAppo().finally(() => {
        isUpdating.current = false
      })
    }
  }, [next])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (update.voteEndTime) setNext(true)
  }, [update.voteEndTime])

  const onPressPrev = () => {
    router.push('/appointment/update1')
  }
  return (
    <SafeAreaView className="flex-1 bg-white justify-between pt-4">
      <View className="flex-1 justify-start">
        <TopHeader title={t('updateAppointment.title')} />
        <StepIndicator
          step={2}
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

export default AppointmentUpdate2
