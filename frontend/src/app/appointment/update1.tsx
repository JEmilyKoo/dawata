import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { SafeAreaView, Text, TextInput, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { Picker } from '@react-native-picker/picker'
import { useRouter } from 'expo-router'

import PrevNextButton from '@/components/PrevNextButton'
import StepIndicator from '@/components/StepIndicator'
import TopHeader from '@/components/TopHeader'
import Category from '@/constants/Category'
import { RootState } from '@/store/store'
import { AppointmentInfo } from '@/types/appointment'

import {
  setUpdateCategory,
  setUpdateName,
} from '../../store/slices/appointmentSlice'

const AppointmentUpdate1 = () => {
  const { t } = useTranslation()
  const { update } = useSelector((state: RootState) => state.appointment)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AppointmentInfo>({
    defaultValues: {
      name: update.name,
      category: update.category,
    },
  })
  const dispatch = useDispatch()
  const router = useRouter()

  const [dispatched, setDispatched] = useState(false)

  useEffect(() => {
    if (dispatched && update.name && update.category) {
      router.push('/appointment/update2')
    }
  }, [dispatched, update.name, update.category])

  const onSubmit = async (data: AppointmentInfo) => {
    dispatch(setUpdateName(data.name))
    dispatch(setUpdateCategory(data.category))
    setDispatched(true)
  }

  return (
    <SafeAreaView className="flex-1 bg-white justify-between">
      <View className="flex-1 justify-start">
        <TopHeader title={t('updateAppointment.title')} />
        <StepIndicator
          step={2}
          nowStep={1}
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
      <PrevNextButton onPressNext={handleSubmit(onSubmit)} />
    </SafeAreaView>
  )
}

export default AppointmentUpdate1
