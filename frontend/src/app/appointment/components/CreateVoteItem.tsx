import { Text, TouchableOpacity, View } from 'react-native'

import MinusCircleIcon from '@/assets/icons/minus-circle.svg'

interface CreateVoteItemProps {
  deleteItem: (id: number) => void
  id: number
}

export default function CreateVoteItem({
  id,
  deleteItem,
}: CreateVoteItemProps) {
  return (
    <View className="w-full justify-between border-b-2 border-bord p-4 flex-row mb-4">
      <View>
        <View className="flex-row">
          <Text className="text-text-primary font-bold text-base pt-[1px]">
            {'title'}
          </Text>
          <Text className="text-text-secondary text-sm pt-1">{'category'}</Text>
        </View>
        <Text>{'roadAddress'}</Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          deleteItem(id)
        }}
        className="w-10 justify-center items-center">
        <MinusCircleIcon />
      </TouchableOpacity>
    </View>
  )
}
