import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import SwitchToggle from 'react-native-switch-toggle'
import { useDispatch, useSelector } from 'react-redux'

import { styles } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetScrollable/BottomSheetFlashList'
import { useRouter } from 'expo-router'

import { createAddress } from '@/apis/address'
import { getAddressCoord } from '@/apis/mapApi'
import CloseCircleIcon from '@/assets/icons/close-circle.svg'
import CrosshairIcon from '@/assets/icons/crosshair.svg'
import MapPinIcon from '@/assets/icons/map-pin.svg'
import SearchIcon from '@/assets/icons/search.svg'
import BackButton from '@/components/BackButton'
import Colors from '@/constants/Colors'
import {
  setCreateAddressName,
  setCreateIsPrimary,
  setCreateLatitude,
  setCreateLongitude,
  setCreateRoadAddress,
} from '@/store/slices/addressSlice'
import { RootState } from '@/store/store'
import { AddressCreate, Coord } from '@/types/address'

export default function CreateAddress() {
  const router = useRouter()
  const { t } = useTranslation()
  const { create, addresses } = useSelector((state: RootState) => state.address)
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AddressCreate>({
    defaultValues: {
      addressName: create.addressName,
      roadAddress: create.roadAddress,
      latitude: create.latitude,
      longitude: create.longitude,
      isPrimary: create.isPrimary,
    },
  })

  const dispatch = useDispatch()
  const [inputValue, setInputValue] = useState('')
  const [isEmpty, setIsEmpty] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const isFirstAddress = !addresses.find((item) => item.isPrimary)
  if (isFirstAddress) {
    dispatch(setCreateIsPrimary(isFirstAddress))
  }
  const selectAddress = (address: Coord) => {
    dispatch(setCreateAddressName(address.address_name))
    dispatch(setCreateRoadAddress(address.address_name))
    dispatch(setCreateLatitude(address.y))
    dispatch(setCreateLongitude(address.x))
    router.push({ pathname: '/profile/createAddress2' })
  }

  const onSubmit = async (data: AddressCreate) => {
    dispatch(setCreateAddressName(data.addressName))
    const result = await createAddress(data)
    if (result) {
      router.push('/profile/manageAddress')
    }
  }
  const styles = StyleSheet.create({
    switchContainer: {
      width: 32,
      height: 16,
      borderRadius: 25,
      padding: 2,
    },
    switchCircle: {
      width: 13,
      height: 13,
      borderRadius: 20,
    },
  })
  return (
    <View className="flex-1 bg-white justify-between">
      <View className="justify-between">
        <ScrollView className="flex-1 w-full flex-col">
          <View className="w-100 flex-col px-4 my-3">
            <Text className="text-xl font-bold mb-3 text-text-primary">
              {t('createAddress.addressName.title')}
            </Text>
            <View className="flex-row mb-2">
              <MapPinIcon
                height={15}
                width={14}
                stroke={Colors.text.secondary}
                strokeWidth={2}
              />
              <Text className="text-xs font-medium text-text-secondary mb-4 ">
                {create.roadAddress}
              </Text>
            </View>
            <Controller
              control={control}
              name="addressName"
              rules={{ required: t('createAddress.addressName.error') }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder={create.addressName}
                  onBlur={onBlur}
                  className="border-b-2 mb-4 border-primary"
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.addressName && (
              <Text className="text-light-red">
                {errors.addressName.message}
              </Text>
            )}
            {!isFirstAddress && (
              <View className="flex-row">
                <Controller
                  control={control}
                  name="isPrimary"
                  render={({ field: { value } }) => (
                    <SwitchToggle
                      switchOn={value}
                      onPress={() => setValue('isPrimary', !value)}
                      circleColorOff="white"
                      backgroundColorOn={Colors.primary}
                      backgroundColorOff={Colors.bord}
                      containerStyle={styles.switchContainer}
                      circleStyle={styles.switchCircle}
                    />
                  )}
                />
                <Text className="text-xs text-text-primary">
                  {t('createAddress.isPrimary')}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
        <View className="flex-row justify-between space-x-2">
          <TouchableOpacity
            className="bg-bord p-2 rounded w-1/4"
            onPress={() => {
              router.back()
            }}>
            <Text className="text-text-primary text-center font-bold">
              {t('prev')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-primary p-2 rounded w-3/4"
            onPress={handleSubmit(onSubmit)}>
            <Text className="text-white text-center font-bold">
              {t('finish')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
