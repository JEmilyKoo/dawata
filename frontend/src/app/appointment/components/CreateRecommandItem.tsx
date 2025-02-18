import { Switch, Text, View } from 'react-native'

import Checkbox from 'expo-checkbox'
import { Link } from 'expo-router'

import RoundCheckBox from '@/components/RoundCheckBox'
import Colors from '@/constants/Colors'
import { Recommand } from '@/types/appointment'

interface CreateRecommandItemProps {
  key: number
  recommand: Recommand
  isSelected: boolean
  onSelect: (id: string, isSelected: boolean) => void
}

export default function CreateRecommandItem({
  key,
  recommand,
  isSelected,
  onSelect,
}: CreateRecommandItemProps) {
  return (
    <View className="w-full justify-between border-b-2 border-bord p-4 flex-row mb-4">
      <View>
        <View className="flex-row">
          <Text className="text-primary font-bold text-xl pr-1">
            {String.fromCharCode(64 + key)}
          </Text>
          <Text className="text-text-primary font-bold text-base pt-[1px]">
            {recommand.place_name}
          </Text>
          <Text className="text-text-secondary text-sm pt-1">
            {recommand.category_name}
          </Text>
        </View>
        <Text>{recommand.road_address_name ?? recommand.address_name}</Text>
        <Link href={recommand.place_url}>
          <Text>{'상세보기'}</Text>
        </Link>
      </View>
      <View className="w-10 justify-center items-center">
        <RoundCheckBox
          isChecked={isSelected}
          setChecked={(newValue) => {
            onSelect(recommand.id, newValue)
          }}
        />
      </View>
    </View>
  )
}
