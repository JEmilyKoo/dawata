// 루틴 상세
import { useEffect, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch } from 'react-redux'

import { useLocalSearchParams, useRouter } from 'expo-router'

import { getRoutine } from '@/apis/routine'
import EditIcon from '@/assets/icons/edit.svg'
import BackButton from '@/components/BackButton'
import { setCreatePlayList } from '@/store/slices/routineSlice'
import { setCreateRoutineName } from '@/store/slices/routineSlice'
import { Play, RoutineDetailInfo } from '@/types/routine'

export default function RoutineDetail() {
  const [totalTime, setTotalTime] = useState(0)
  const [playList, setPlayList] = useState<Play[]>([])

  const router = useRouter()
  const { routineId } = useLocalSearchParams()
  const dispatch = useDispatch()

  const [routine, setRoutine] = useState<RoutineDetailInfo>()
  useEffect(() => {
    const fetchRoutine = async () => {
      const response = await getRoutine(Number(routineId))
      setRoutine(response)
      console.log('response', response)
      setPlayList(response.playList)
      setTotalTime(
        response.playList.reduce(
          (acc: number, cur: Play) => acc + cur.spendTime,
          0,
        ),
      )
    }
    fetchRoutine()
  }, [])
  return (
    <View className="flex-1 bg-white p-4">
      <View className="flex-row justify-between pb-2 border-b border-bord">
        <View className="flex-row">
          <BackButton />
          <View className="flex-1 mt-2">
            <Text className="text-xl font-bold">{routine?.routineName}</Text>
          </View>
        </View>
        <TouchableOpacity
          className="mt-3"
          onPress={() => {
            dispatch(setCreateRoutineName(routine?.routineName))
            dispatch(setCreatePlayList(playList))
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
