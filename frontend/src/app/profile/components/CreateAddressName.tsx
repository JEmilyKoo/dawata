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
import PrevNextButton from '@/components/PrevNextButton'
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
    },
    switchCircle: {
      width: 14,
      height: 14,
      borderRadius: 20,
      right: 4,
    },
  })
  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 w-full px-4 ">
        <View className="my-3">
          <Text className="text-xl font-bold mb-3 text-text-primary">
            {t('createAddress.addressName.title')}
          </Text>
          <View className="flex-row mb-2 items-center">
            <MapPinIcon
              height={15}
              width={14}
              stroke={Colors.text.secondary}
              strokeWidth={2}
            />
            <Text className="text-xs font-medium text-text-secondary ml-2">
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
                className="border-b-2 mb-4 border-primary w-full text-base"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.addressName && (
            <Text className="text-light-red">{errors.addressName.message}</Text>
          )}
          {!isFirstAddress && (
            <View className="flex-row items-center space-x-2">
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
      <PrevNextButton
        onPressPrev={() => {
          router.back()
        }}
        onPressNext={handleSubmit(onSubmit)}
        nextText={t('finish')}
      />
    </View>
  )
}
