import { Text, View } from 'react-native'
import { Menu, MenuOptions, MenuTrigger } from 'react-native-popup-menu'

import HomeIcon from '@/assets/icons/home.svg'
import MapPinIcon from '@/assets/icons/map-pin.svg'
import MoreIcon from '@/assets/icons/more.svg'
import MenuCustomOptions from '@/components/MenuCustomOptions'
import Colors from '@/constants/Colors'
import { Address } from '@/types/address'
import { MenuItem } from '@/types/menu'

interface AddressItemProps {
  address: Address
  removeAddress: (id: number) => void
}

export default function AddressItem({
  address,
  removeAddress,
}: AddressItemProps) {
  const menu: MenuItem[] = [
    {
      title: '삭제',
      onSelect: () => {
        if (address.id) {
          removeAddress(address.id)
        }
      },
      color: Colors.light.red,
    },
  ]
  return (
    <View className="flex-row items-start px-4 py-4 border-b border-gray-100">
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
        <Text className="text-base font-semibold mb-1">{address.name}</Text>
        <Text className="text-base text-gray-900">{address.roadAddress}</Text>
      </View>
      <Menu>
        <MenuTrigger>
          <MoreIcon
            width={24}
            height={24}
          />
        </MenuTrigger>
        <MenuOptions>
          <MenuCustomOptions menuList={menu} />
        </MenuOptions>
      </Menu>
    </View>
  )
}
