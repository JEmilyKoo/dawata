import { Switch, Text, View } from 'react-native'

import Checkbox from 'expo-checkbox'
import { Link } from 'expo-router'

import RoundCheckBox from '@/components/RoundCheckBox'
import Colors from '@/constants/Colors'
import { VoteInfo } from '@/types/appointment'

interface VoteItemProps {
  voteInfo: VoteInfo
  onSelect: (id: number, isSelected: boolean) => void
  disabled: boolean
}

export default function VoteItem({
  voteInfo,
  onSelect,
  disabled,
}: VoteItemProps) {
  return (
    <View className="w-full justify-between border-b-2 border-bord p-4 flex-row mb-4">
      <View>
        <View className="flex-row">
          <Text className="text-primary font-bold text-xl pr-1">
            {String.fromCharCode(64 + voteInfo.voteItemId)}
          </Text>
          <Text className="text-text-primary font-bold text-base pt-[1px]">
            {voteInfo.title}
          </Text>
          <Text className="text-text-secondary text-sm pt-1">
            {voteInfo.category}
          </Text>
        </View>
        <Text>{voteInfo.roadAddress}</Text>
        <Link href={'http://' + voteInfo.linkUrl}>
          <Text>{voteInfo.linkUrl}</Text>
        </Link>
      </View>
      <View className="w-10 justify-center items-center">
        <RoundCheckBox
          isChecked={voteInfo.isSelected}
          setChecked={(newValue) => {
            if (!disabled) {
              onSelect(voteInfo.voteItemId, newValue)
            }
          }}
          disabled={disabled}
        />
      </View>
    </View>
  )
}
