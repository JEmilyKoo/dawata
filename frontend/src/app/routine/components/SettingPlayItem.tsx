// 루틴 추가, 수정할 때 각기 행동 항목 아이템
import { Text, TouchableOpacity, View } from 'react-native'

import DragIcon from '@/assets/icons/drag.svg'
import EditIcon from '@/assets/icons/edit.svg'
import TrashIcon from '@/assets/icons/trash.svg'

interface SettingPlayItemProps {
  playId: number
  playName: string
  spendTime: number
  editPlay: (id: number) => void
  deltePlay: (id: number) => void
  onLongPressPlayItem: (id: number) => void
}

export default function SettingPlayItem({
  playId,
  playName,
  spendTime,
  editPlay,
  deltePlay,
  onLongPressPlayItem,
}: SettingPlayItemProps) {
  return (
    <View>
      <View className="flex-row justify-between items-center bg-white p-3 my-2 rounded-lg border border-bord">
        <View className="flex-row justify-between w-3/4">
          <Text className="text-base font-medium text-text-primary">
            {playName}
          </Text>
          <Text className="text-base text-text-primary">{spendTime}분</Text>
        </View>
        <View className="flex-row space-x-2 justify-center items-center">
          <TouchableOpacity onPress={() => editPlay(playId)}>
            <EditIcon />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deltePlay(playId)}>
            <TrashIcon />
          </TouchableOpacity>
          <TouchableOpacity onLongPress={() => onLongPressPlayItem(playId)}>
            <DragIcon />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
