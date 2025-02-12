import { useEffect } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { useRouter } from 'expo-router'

import { getAddresses } from '@/apis/address'
import ArrowRightIcon from '@/assets/icons/chevron-right.svg'
import HomeIcon from '@/assets/icons/home.svg'
import MapPinIcon from '@/assets/icons/map-pin.svg'
import MoreIcon from '@/assets/icons/more.svg'
import PlusCircleIcon from '@/assets/icons/plus-circle.svg'
import BackButton from '@/components/BackButton'
import Colors from '@/constants/Colors'
import { setAddresses } from '@/store/slices/addressSlice'
import { RootState } from '@/store/store'
import { Address } from '@/types/address'

export default function ManageAddress() {
  const dispatch = useDispatch()
  const { addresses } = useSelector((state: RootState) => state.address)
  const router = useRouter()
  const fetchAddresses = async () => {
    try {
      const result: Address[] = await getAddresses()
      console.log(':result', result)
      if (result) {
        dispatch(setAddresses(result))
      }
    } catch (error) {
      console.error('주소 목록을 가져오는 중 오류 발생:', error)
    }
  }

  useEffect(() => {
    fetchAddresses()
  }, [])
  return (
    <View className="flex-1 bg-white">
      {/* 헤더 */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
        <View className="flex-row p-4 pt-2">
          <BackButton />
          <Text className="text-xl font-bold mt-2">주소 관리</Text>
        </View>
      </View>
      <ScrollView className="flex-1">
        {/* 새 주소 추가 버튼 */}
        <TouchableOpacity
          className="flex-row items-center px-4 py-4 border-b border-gray-100"
          onPress={() => {
            router.push('/profile/createAddress')
          }}>
          <PlusCircleIcon
            width={24}
            height={24}
          />
          <Text className="text-xl font-medium ml-3">새 주소 추가</Text>
        </TouchableOpacity>
        {addresses &&
          addresses.map((address) => (
            <TouchableOpacity
              key={address.id}
              className="flex-row items-start px-4 py-4 border-b border-gray-100"
              onPress={() => {
                /* 주소 수정 로직 */
              }}>
              <View className="mr-3 mt-1">
                {address.isPrimary ? (
                  <HomeIcon
                    width={24}
                    height={24}
                  />
                ) : (
                  <MapPinIcon
                    width={24}
                    height={24}
                    stroke={Colors.text.primary}
                    strokeWidth={2}
                  />
                )}
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold mb-1">
                  {address.name}
                </Text>
                <Text className="text-base text-gray-900">
                  {address.roadAddress}
                </Text>
              </View>
              <MoreIcon
                width={24}
                height={24}
              />
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  )
}
