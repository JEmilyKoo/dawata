import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { Picker } from '@react-native-picker/picker'
import { useLocalSearchParams, useRouter } from 'expo-router'

import { createClub, updateClub } from '@/apis/club'
import SlideModalUI from '@/components/SlideModalUI'
import Category from '@/constants/Category'
import { RootState } from '@/store/store'
import { ClubCreateInfo } from '@/types/club'

import {
  setClubs,
  setCreateCategory,
  setCreateName,
} from '../../store/slices/clubSlice'

type RouteParams = {
  clubId: string
}

const UpdteClubInfo = () => {
  const { t } = useTranslation()
  const { create, clubs } = useSelector((state: RootState) => state.club)
  const params = useLocalSearchParams<RouteParams>()
  const clubId = Number(params.clubId)
  const clubInfo = clubs.find((club) => club.id === Number(clubId))
  const dispatch = useDispatch()

  if (clubInfo) {
    dispatch(setCreateName(clubInfo.name))
    dispatch(setCreateCategory(clubInfo.category))
  }

  const [isVisible, setIsVisible] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ClubCreateInfo>({
    defaultValues: {
      name: create.name,
      category: create.category,
    },
  })
  const router = useRouter()

  const onSubmit = async (data: ClubCreateInfo) => {
    dispatch(setCreateName(data.name))
    dispatch(setCreateCategory(data.category))
    dispatch(
      setClubs(
        clubs.map((club) =>
          club.id === clubId
            ? { ...club, name: data.name, category: data.category }
            : club,
        ),
      ),
    )
    const result = await updateClub({
      clubId: clubId,
      name: data.name,
      category: data.category,
    })
    if (result) {
      setIsVisible(true)
    }
  }

  const onPressMove = () => {
    router.push({
      pathname: '/club/main',
      params: { clubId },
    })
    setIsVisible(false)
  }

  const onPressGoToHome = () => {
    router.push('/(tabs)/main')
    setIsVisible(false)
  }

  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      <View className="flex-1 justify-between">
        <View>
          <Text className="text-xl font-bold mb-2 text-text-primary">
            {t('createClub.name.title')}
          </Text>
          <Text className="text-xs font-bold mb-2 text-text-secondary">
            {t('createClub.name.subTitle')}
          </Text>
          <Controller
            control={control}
            name="name"
            rules={{ required: t('createClub.name.error') }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder={t('createClub.name.title')}
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

          <Text className="text-xl font-bold mb-2">
            {t('createClub.category.title')}
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
        </View>
        <TouchableOpacity
          className="bg-primary p-2 rounded"
          onPress={handleSubmit(onSubmit)}>
          <Text className="text-white text-center font-bold">
            {t('finish')}
          </Text>
        </TouchableOpacity>
      </View>
      <SlideModalUI
        isVisible={isVisible}
        setVisible={setIsVisible}
        modalTitle="그룹을 수정했습니다."
        modalContent={`${create.name} 그룹으로 이동하시겠습니까?`}
        primaryButtonText="이동"
        primaryButtonOnPress={onPressMove}
        secondaryButtonText={t('goToHome')}
        secondaryButtonOnPress={onPressGoToHome}
      />
    </SafeAreaView>
  )
}

export default UpdteClubInfo
