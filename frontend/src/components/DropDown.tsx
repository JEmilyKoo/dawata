import { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import ArrowDropDownIcon from '@/assets/icons/arrow-drop-down.svg'
import ArrowDropUpIcon from '@/assets/icons/arrow-drop-up.svg'

export default function DropDown({
  title,
  children,
  preOpen,
  subtitle,
}: {
  title: string
  children: React.ReactNode
  preOpen?: boolean
  subtitle?: string
}) {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false)

  useEffect(() => {
    setIsDropDownOpen(preOpen ?? false)
  }, [preOpen])
  return (
    <View className="">
      <TouchableOpacity
        onPress={() => setIsDropDownOpen(!isDropDownOpen)}
        className="w-full flex-row justify-between items-center p-3 border border-bord rounded-lg mb-4">
        <View className="flex-1 flex-row justify-between items-center">
          <Text className="text-xl text-text-primary font-medium">{title}</Text>
          {subtitle && (
            <Text className="text-base text-text-primary font-light">
              {subtitle}
            </Text>
          )}
        </View>

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
