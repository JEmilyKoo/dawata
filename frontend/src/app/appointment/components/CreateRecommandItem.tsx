import { Switch, Text, View } from 'react-native'

import Checkbox from 'expo-checkbox'
import { Link } from 'expo-router'

import MarqueeText from '@/components/MarqueeText'
import RoundCheckBox from '@/components/RoundCheckBox'
import Colors from '@/constants/Colors'
import { CategoryGroupCodeType, Recommand } from '@/types/appointment'

interface CreateRecommandItemProps {
  index: number
  recommand: Recommand
  isSelected: boolean
  onSelect: (id: string, isSelected: boolean) => void
}

export default function CreateRecommandItem({
  index,
  recommand,
  isSelected,
  onSelect,
}: CreateRecommandItemProps) {
  return (
    <View className="justify-between border-b-2 border-bord px-4 pb-4 flex-row mb-4 bg-white">
      <View className="flex-1">
        <View className="flex-row items-center">
          <Text className="text-primary font-bold text-xl pr-1">
            {String.fromCharCode(65 + index)}
          </Text>
          <Text className="text-text-primary font-bold text-base pt-[1px] mr-2">
            {recommand.place_name}
          </Text>
          <MarqueeText
            text={recommand.category_name}
            speed={50}
            className="pt-1"
          />
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
            console.log('newValue', !newValue)
            onSelect(recommand.id, !newValue)
          }}
        />
      </View>
    </View>
  )
}
