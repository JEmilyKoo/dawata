import { Text, TouchableOpacity, View } from 'react-native'

import MinusCircleIcon from '@/assets/icons/minus-circle.svg'
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
    <View className="w-full justify-between border-b-2 border-bord p-4 flex-row mb-4">
      <View>
        <View className="flex-row">
          <Text className="text-text-primary font-bold text-base pt-[1px]">
            {recommand.place_name}
          </Text>
          <Text className="text-text-secondary text-sm pt-1">
            {recommand.category_name}
          </Text>
        </View>
        <Text>{recommand.road_address_name ?? recommand.address_name}</Text>
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
