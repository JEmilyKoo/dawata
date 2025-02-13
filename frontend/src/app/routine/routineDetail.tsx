// 루틴 상세
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

import { useLocalSearchParams, useRouter } from 'expo-router'

import EditIcon from '@/assets/icons/edit.svg'
import BackButton from '@/components/BackButton'

const playList = [
  { playId: 1, playName: '머리만 감기', spendTime: 5 },
  { playId: 2, playName: '샤워', spendTime: 20 },
  { playId: 3, playName: '옷 갈아입기', spendTime: 5 },
]

export default function RoutineDetail() {
  const totalTime = 30

  const router = useRouter()
  const { routineId } = useLocalSearchParams()
  return (
    <View className="flex-1 bg-white p-4">
      <View className="flex-row justify-between pb-2 border-b border-bord">
        <View className="flex-row">
          <BackButton />
          <View className="flex-1 mt-2">
            <Text className="text-xl font-bold">준비 10분 컷</Text>
          </View>
        </View>
        <TouchableOpacity
          className="mt-3"
          onPress={() => {
            router.push({
              pathname: '/routine/updateRoutine',
              params: { routineId },
            })
          }}>
          <EditIcon className="w-5 h-5 text-gray-400" />
        </TouchableOpacity>
      </View>
      <Text className="text-lg font-bold mt-4">행동</Text>
      {playList.map((item) => (
        <View
          key={item.playId}
          className="flex-row justify-between items-center bg-white p-3 my-2 rounded-lg border border-bord">
          <Text className="text-base font-medium">{item.playName}</Text>
          <Text className="text-base text-primary">{item.spendTime}분</Text>
        </View>
      ))}
      <View className="flex-row justify-between items-center mt-3">
        <Text className="text-base font-medium ">예상 소요 시간</Text>
        <Text className="text-xl font-bold text-primary">{totalTime}분</Text>
      </View>
    </View>
  )
}
