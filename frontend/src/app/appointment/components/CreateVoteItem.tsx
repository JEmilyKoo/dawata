import { Text, TouchableOpacity, View } from 'react-native'

import MinusCircleIcon from '@/assets/icons/minus-circle.svg'
import MarqueeText from '@/components/MarqueeText'
import { Recommand } from '@/types/appointment'

interface CreateVoteItemProps {
  deleteItem: (id: string) => void
  recommand: Recommand
}

export default function CreateVoteItem({
  recommand,
  deleteItem,
}: CreateVoteItemProps) {
  return (
    <View className="justify-between border-b-2 border-bord px-4 pb-4 flex-row mb-4 bg-white">
      <View className="flex-1">
        <View className="flex-row">
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

        <Text>{recommand.distance}m</Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          deleteItem(recommand.id)
        }}
        className="w-10 justify-center items-center">
        <MinusCircleIcon />
      </TouchableOpacity>
    </View>
  )
}
