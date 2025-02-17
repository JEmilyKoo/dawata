import { Text, View } from 'react-native'

import BackButton from '@/components/BackButton'

export default function TopHeader({ title }: { title: String }) {
  return (
    <View className="flex-row p-2 items-center">
      <BackButton />
      <View className="flex-1">
        <Text className="text-xl font-bold">{title}</Text>
      </View>
    </View>
  )
}
