import { useTranslation } from 'react-i18next'
import { Text, TouchableOpacity, View } from 'react-native'
import { Menu, MenuOptions, MenuTrigger } from 'react-native-popup-menu'

import ChevronDownIcon from '@/assets/icons/chevron-down.svg'
import ImageThumbnail from '@/components/ImageThumbnail'
import MenuCustomOptions from '@/components/MenuCustomOptions'
import Colors from '@/constants/Colors'
import { Club } from '@/types/club'
import { MenuItem } from '@/types/menu'

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
        className="rounded-xl border border-bord"
      />
      <View className="flex-1 ml-2 justify-between h-[80px]">
        <View className="flex-row items-center">
          <Text className="text-base font-bold text-text-primary">
            {clubInfo.name}
          </Text>
          <Text className="text-base font-bold text-text-secondary ml-2">
            {'#' + t(`category.${clubInfo.category}`)}
          </Text>
        </View>
        <View className="flex-row">
          <View className="flex-row space-x-1">
            {clubInfo.members.slice(0, 6).map((member, index) => (
              <View key={index}>
                <ImageThumbnail
                  img={member.img}
                  defaultImg={defaultImg}
                  width={16}
                  height={16}
                  className="rounded-full mr-1 border border-bord"
                />
              </View>
            ))}
            <Text>명</Text>
          </View>
        </View>
        <View className="flex-row space-x-1">
          <Text className="text-xs text-text-primary border-r border-bord pr-1">
            그룹 생성일
          </Text>
          <Text className="text-xs text-text-primary pl-1">
            {new Date(clubInfo.createDate).toLocaleString('ko', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
