import { useTranslation } from 'react-i18next'
import { Pressable, Text, View } from 'react-native'

import ListIcon from '@/assets/icons/list.svg'
import ThumbsUpIcon from '@/assets/icons/thumbs-up.svg'
import TabBarIcon from '@/components/TabBarIcon'
import colors from '@/constants/Colors'

export default function RecommandTabBar({
  isList,
  setIsList,
}: {
  isList: boolean
  setIsList: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { t } = useTranslation()

  const tabs = [
    {
      name: 'recommand',
      icon: ThumbsUpIcon,
    },
    {
      name: 'list',
      icon: ListIcon,
    },
  ]

  return (
    <View
      className="w-1/2"
      style={{
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 }, // 더 자연스러운 그림자
        shadowOpacity: 0.55, // 더 부드러운 그림자
        shadowRadius: 6, // 퍼지는 정도 증가
        height: 65,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        elevation: 8, // Android에서 효과 강화
      }}>
      {tabs.map((tab) => {
        const isFocused = (tab.name == 'list') == isList

        return (
          <Pressable
            key={tab.name}
            onPress={() => {
              setIsList(tab.name == 'list')
            }}
            style={[
              {
                flex: 1,
                alignItems: 'center',
                borderTopWidth: tab.name !== 'live' ? 1 : 0,
                borderTopColor: isFocused ? colors.primary : colors.secondary,
                marginHorizontal: 10,
                paddingTop: 10,
              },
            ]}>
            <>
              <TabBarIcon
                Icon={tab.icon}
                color={isFocused ? colors.primary : colors.secondary}
              />
              <Text
                style={{
                  color: isFocused ? colors.primary : colors.secondary,
                }}
                className="text-sm">
                {t(tab.name)}
              </Text>
            </>
          </Pressable>
        )
      })}
    </View>
  )
}
