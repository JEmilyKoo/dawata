import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

import { useRouter } from 'expo-router'

import ArrowRightIcon from '@/assets/icons/chevron-right.svg'
import HomeIcon from '@/assets/icons/home.svg'
import MapPinIcon from '@/assets/icons/map-pin.svg'
import MoreIcon from '@/assets/icons/more.svg'
import PlusCircleIcon from '@/assets/icons/plus-circle.svg'
import BackButton from '@/components/BackButton'

interface Address {
  id: number
  type: string
  address: string
}

const addresses: Address[] = [
  {
    id: 1,
    type: '집',
    address: '서울특별시 강남구 테헤란로 123',
  },
  {
    id: 2,
    type: '주소1',
    address: '서울특별시 마포구 홍익로 45',
  },
  {
    id: 3,
    type: '주소2',
    address: '서울특별시 서초구 서초대로 77길 15',
  },
  {
    id: 4,
    type: '주소3',
    address: '서울특별시 성동구 왕십리로 99',
  },
  {
    id: 5,
    type: '집',
    address: '서울특별시 종로구 세종대로 55',
  },
]

export default function ManageAddress() {
  const router = useRouter()
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

        {/* 주소 목록 */}
        {addresses.map((address) => (
          <TouchableOpacity
            key={address.id}
            className="flex-row items-start px-4 py-4 border-b border-gray-100"
            onPress={() => {
              /* 주소 수정 로직 */
            }}>
            <View className="mr-3 mt-1">
              {address.type === '집' ? (
                <HomeIcon
                  width={24}
                  height={24}
                />
              ) : (
                <MapPinIcon
                  width={24}
                  height={24}
                />
              )}
            </View>
            <View className="flex-1">
              {address.type && (
                <Text className="text-base font-semibold mb-1">
                  {address.type}
                </Text>
              )}
              <Text className="text-base text-gray-900">{address.address}</Text>
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
