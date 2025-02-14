import { useTranslation } from 'react-i18next'
import { Image, Text, TouchableOpacity, View } from 'react-native'

import ChevronDownIcon from '@/assets/icons/chevron-down.svg'
import ImageThumbnail from '@/components/ImageThumbnail'
import { Club } from '@/types/club'

export default function ClubItem({ clubInfo }: { clubInfo: Club }) {
  const defaultImg = require('@/assets/clubs/club3.png')
  const { t } = useTranslation()
  return (
    <TouchableOpacity
      key={clubInfo.clubId}
      className="flex-row justify-between items-center pb-4 rounded-xl mb-3">
      <ImageThumbnail
        img={clubInfo.img}
        defaultImg={defaultImg}
        width={80}
        height={80}
        className="rounded-xl"
      />
      <View className="flex-1 ml-2">
        <View className="flex-row items-center">
          <Text className="text-base font-medium mb-1">{clubInfo.name}</Text>
          <Text className="text-sm text-gray-500 ml-2">
            {'#' + t(`category.${clubInfo.category}`)}
          </Text>
        </View>
        <View className="flex-row space-x-1">
          {clubInfo.members.map((member, index) => (
            <View key={index}>
              <ImageThumbnail
                img={member.img}
                defaultImg={defaultImg}
                width={16}
                height={16}
                className="rounded-full mr-2"
              />
            </View>
          ))}
        </View>
        <View className="flex-row space-x-1">
          <Text className="text-xs text-text-primary">
            {clubInfo.createdAt}
          </Text>
        </View>
      </View>
      <ChevronDownIcon
        height={24}
        width={24}
      />
    </TouchableOpacity>
  )
}
