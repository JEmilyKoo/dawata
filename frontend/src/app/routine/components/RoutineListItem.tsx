// 루틴 리스트의 각 루틴 아이템
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

import TrashIcon from '@/assets/icons/trash.svg'
import { Routine } from '@/types/routine'

interface RoutineListItemProps {
  routine: Routine
  onPressRoutineListItem: (routineId: number) => void
  deleteRoutine: (routineId: number) => void
}

export default function RoutineListItem({
  routine,
  onPressRoutineListItem,
  deleteRoutine,
}: RoutineListItemProps) {
  return (
    <TouchableOpacity
      className="flex-row justify-between items-center p-4 mb-2 rounded-lg border border-bord"
      onPress={() => onPressRoutineListItem(routine.routineId)}>
      <Text className="text-base font-medium">{routine.routineName}</Text>
      <View className="flex-row items-center gap-2">
        <Text className="text-gray-600">{routine.totalTime}분</Text>
        <TouchableOpacity onPress={() => deleteRoutine(routine.routineId)}>
          <TrashIcon className="w-5 h-5 text-gray-500" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}
