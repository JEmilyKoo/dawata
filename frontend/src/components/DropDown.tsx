import { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import ArrowDropDownIcon from '@/assets/icons/arrow-drop-down.svg'
import ArrowDropUpIcon from '@/assets/icons/arrow-drop-up.svg'

export default function DropDown({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false)
  return (
    <View className="h-full w-full">
      <TouchableOpacity
        onPress={() => setIsDropDownOpen(!isDropDownOpen)}
        className="w-full flex-row justify-between items-center p-3 border border-bord rounded-lg mb-4">
        <Text className="text-base text-text-primary">{title}</Text>

        {isDropDownOpen ? (
          <ArrowDropUpIcon
            height={24}
            width={25}
          />
        ) : (
          <ArrowDropDownIcon
            height={24}
            width={25}
          />
        )}
      </TouchableOpacity>
      <View className="w-full pb-3">{isDropDownOpen && children}</View>
    </View>
  )
}
