import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { useRouter } from 'expo-router'

import { getAddressCoord } from '@/apis/mapApi'
import CloseCircleIcon from '@/assets/icons/close-circle.svg'
import CrosshairIcon from '@/assets/icons/crosshair.svg'
import MapPinIcon from '@/assets/icons/map-pin.svg'
import SearchIcon from '@/assets/icons/search.svg'
import TopHeader from '@/components/TopHeader'
import Colors from '@/constants/Colors'
import { RootState } from '@/store/store'
import { AddressCreate, Coord } from '@/types/address'

import {
  setCreateAddressName,
  setCreateLatitude,
  setCreateLongitude,
  setCreateRoadAddress,
} from '../../store/slices/addressSlice'

export default function CreateAddress() {
  const router = useRouter()
  const { t } = useTranslation()
  const { create } = useSelector((state: RootState) => state.address)
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressCreate>({
    defaultValues: {
      addressName: '',
    },
  })

  const dispatch = useDispatch()
  const [inputValue, setInputValue] = useState('')
  const [searchedAddresses, setSearchedAddresses] = useState<Coord[] | null>(
    null,
  )
  const [isEmpty, setIsEmpty] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const selectAddress = (address: Coord) => {
    dispatch(setCreateAddressName(address.address_name))
    dispatch(setCreateRoadAddress(address.address_name))
    dispatch(setCreateLatitude(address.y))
    dispatch(setCreateLongitude(address.x))
    router.push({
      pathname: '/profile/createAddress2',
    })
  }

  const fetchAddressCoord = async (roadAddress: string) => {
    setShowLoading(true)
    const data = await getAddressCoord(roadAddress)
    setShowLoading(false)
    if (!data) {
      setIsEmpty(true)
      return
    }
    if (data.data.meta.total_count === 0) {
      setSearchedAddresses([])
    } else if (data.data.documents) {
      const roadAddress: Coord[] = data.data.documents.map((item: any) => {
        return {
          address_name: item.road_address
            ? item.road_address.address_name
            : item.address_name,
          x: item.road_address ? item.road_address.x : item.address.x,
          y: item.road_address ? item.road_address.y : item.address.y,
        }
      })
      if (roadAddress) {
        setSearchedAddresses(roadAddress)
        setIsEmpty(false)
        return
      }
    }

    setIsEmpty(true)
  }

  const onSubmit = async (data: { addressName: string }) => {
    if (data.addressName) {
      await fetchAddressCoord(data.addressName)
    }
  }
  return (
    <View className="flex-1 bg-white  pt-4">
      <TopHeader title="주소 설정" />
      <ScrollView className="flex-1 w-full">
        <View className="w-100 flex-row border-b border-gray-200 px-4 my-3">
          <TouchableOpacity
            className="mr-2"
            onPress={handleSubmit(onSubmit)}>
            <SearchIcon />
          </TouchableOpacity>
          <Controller
            control={control}
            name="addressName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder={t('createAddress.search.title')}
                onBlur={onBlur}
                className="flex-1 border-b-2 mb-4 border-primary"
                onChangeText={(e) => {
                  setInputValue(e)
                  onChange(e)
                }}
                value={inputValue}
              />
            )}
          />
          {inputValue != '' && (
            <TouchableOpacity onPress={() => setInputValue('')}>
              <CloseCircleIcon className="mr-2" />
            </TouchableOpacity>
          )}
        </View>
        {isEmpty && (
          <View className="px-4">
            <Text className="text-sm text-text-secondary">
              {t('createAddress.search.error')}
            </Text>
          </View>
        )}
        {showLoading && (
          <View className="inset-0 items-center justify-center">
            <ActivityIndicator
              size="small"
              color={Colors.primary}
            />
          </View>
        )}
        {!searchedAddresses && (
          <TouchableOpacity
            onPress={() => {}}
            className="flex-1 flex-row border border-text-secondary rounded-lg py-4 m-4 justify-center items-center">
            <CrosshairIcon />
            <Text className="text-base ml-2 text-text-primary text-center">
              {t('createAddress.searchCurrentLocation.title')}
            </Text>
          </TouchableOpacity>
        )}
        {searchedAddresses &&
          searchedAddresses.map((address) => (
            <TouchableOpacity
              key={address.address_name}
              className="flex-row items-start px-4 py-4 border-b border-bord"
              onPress={() => selectAddress(address)}>
              <View className="mr-3 mt-1">
                <MapPinIcon
                  width={24}
                  height={24}
                  stroke={Colors.text.primary}
                  strokeWidth={2}
                />
              </View>
              <View className="flex-1">
                <View className="flex-row">
                  <Text className="text-base font-medium mr-1 text-text-primary">
                    {address.address_name}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  )
}
