import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { Picker } from '@react-native-picker/picker'
import { useRouter } from 'expo-router'

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
    <View className="flex-1 p-4">
      <Text className="text-xl font-bold mb-2 text-text-primary">
        {t('createAppointment.name.title')}
      </Text>
      <Text className="text-xs font-bold mb-2 text-text-secondary">
        {t('createAppointment.name.subTitle')}
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

      <Text className="text-xl font-bold mb-2 text-text-primary">
        {t('createAppointment.category.title')}
      </Text>
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
      <TouchableOpacity
        className="bg-primary p-2 rounded"
        onPress={handleSubmit(onSubmit)}>
        <Text className="text-white text-center font-bold">{t('next')}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default AppointmentUpdate1
