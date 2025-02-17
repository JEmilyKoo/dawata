import { useEffect } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { useRouter } from 'expo-router'

import { deleteAddress, getAddresses } from '@/apis/address'
import PlusCircleIcon from '@/assets/icons/plus-circle.svg'
import TopHeader from '@/components/TopHeader'
import { filterOutAddress, setAddresses } from '@/store/slices/addressSlice'
import { RootState } from '@/store/store'
import { Address } from '@/types/address'

import AddressItem from './components/AddressItem'

export default function ManageAddress() {
  const dispatch = useDispatch()
  const { addresses } = useSelector((state: RootState) => state.address)
  const router = useRouter()
  const fetchAddresses = async () => {
    try {
      const result: Address[] = await getAddresses()
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

  const removeAddress = async (id: number) => {
    try {
      dispatch(filterOutAddress(id))
      const result = await deleteAddress(id)
      if (result) {
        fetchAddresses
      }
    } catch (error) {
      console.error('주소 목록 삭제 중 오류 발생:', error)
    }
  }
  return (
    <View className="flex-1 bg-white">
      <TopHeader title="주소 관리" />
      <ScrollView className="flex-1">
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
          addresses.map((address: Address) => (
            <AddressItem
              address={address}
              key={address.id}
              removeAddress={removeAddress}
            />
          ))}
      </ScrollView>
    </View>
  )
}
