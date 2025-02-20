import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { SafeAreaView, Text, TextInput, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { Picker } from '@react-native-picker/picker'
import { useRouter } from 'expo-router'

import { updateAppointment } from '@/apis/appointment'
import PrevNextButton from '@/components/PrevNextButton'
import StepIndicator from '@/components/StepIndicator'
import TopHeader from '@/components/TopHeader'
import Category from '@/constants/Category'
import { RootState } from '@/store/store'
import { AppointmentCreateInfo } from '@/types/appointment'

import {
  setCreateCategory,
  setCreateName,
} from '../../store/slices/appointmentSlice'

const AppointmentCreate1 = () => {
  const { t } = useTranslation()
  const { create, createAppointmentId } = useSelector(
    (state: RootState) => state.appointment,
  )
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AppointmentCreateInfo>({
    defaultValues: {
      name: create.name,
      category: create.category,
    },
  })
  const dispatch = useDispatch()
  const router = useRouter()

  const onSubmit = async (data: AppointmentCreateInfo) => {}

  const onPressNext = handleSubmit(async (data: AppointmentCreateInfo) => {
    dispatch(setCreateName(data.name))
    dispatch(setCreateCategory(data.category))

    let update = {
      scheduledAt: create.scheduledAt,
      voteEndTime: create.voteEndTime,
      name: data.name,
      category: data.category,
      appointmentId: createAppointmentId,
    }
    if (await updateAppointment(update)) {
      router.push({
        pathname: '/appointment/detail',
        params: { id: update.appointmentId },
      })
    } else {
      console.log('오류 발생')
    }
    router.push('/appointment/create4')
  })

  const onPressPrev = handleSubmit(() => {
    router.push('/appointment/create2')
  })

  return (
    <SafeAreaView className="flex-1 bg-white justify-between">
      <View className="flex-1 justify-start">
        <TopHeader title={t('createAppointment.title')} />
        <StepIndicator
          step={4}
          nowStep={3}
        />
        <View className="p-5">
          <Text className="text-xl font-bold mb-2 text-text-primary mb-5">
            {t('createAppointment.name.title')}
          </Text>
          <Controller
            control={control}
            name="name"
            rules={{ required: t('createAppointment.name.error') }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder={t('createAppointment.name.title')}
                onBlur={onBlur}
                className="border-b-2 mb-4 border-primary"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.name && (
            <Text className="text-light-red">{errors.name.message}</Text>
          )}

          <Text className="text-xl font-bold mb-2 text-text-primary mt-4">
            {t('createAppointment.category.title')}
          </Text>

          <View className="border border-primary rounded-md">
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Picker
                  selectedValue={field.value}
                  onValueChange={field.onChange}
                  className="border-2 p-2 mb-4">
                  {Category.map((item) => (
                    <Picker.Item
                      key={item}
                      label={t(`category.${item}`)}
                      value={item}
                    />
                  ))}
                </Picker>
              )}
            />
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

export default AppointmentCreate1
