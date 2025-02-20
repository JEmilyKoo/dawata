// 루틴 리스트
import { useEffect, useState } from 'react'
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { useRouter } from 'expo-router'

import { getRoutines, removeRoutine } from '@/apis/routine'
import RoutineListItem from '@/app/routine/components/RoutineListItem'
import PlusIcon from '@/assets/icons/plus.svg'
import BackButton from '@/components/BackButton'
import SlideModalUI from '@/components/SlideModalUI'
import TopHeader from '@/components/TopHeader'
import { Routine } from '@/types/routine'

export default function RoutineList() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [deleteRoutineId, setDeleteRoutineId] = useState(0)
  const deleteRoutine = (routineId: number) => {
    setDeleteRoutineId(routineId)
    setIsVisible(true)
  }

  const [routines, setRoutines] = useState<Routine[]>([])

  useEffect(() => {
    const fetchRoutines = async () => {
      const data = await getRoutines()
      setRoutines(data?.content || [])
    }
    fetchRoutines()
  }, [])

  const onPressDelete = async () => {
    const response = await removeRoutine(deleteRoutineId)
    setIsVisible(false)
    router.replace({
      pathname: '/routine/routineList',
    })
  }
  return (
    <View className="flex-1 bg-white pt-4">
      <TopHeader title="내 루틴 목록" />
      <FlatList
        data={routines}
        keyExtractor={(item) => item.routineId.toString()}
        renderItem={({ item }) => (
          <RoutineListItem
            routine={item}
            key={item.routineId}
            deleteRoutine={deleteRoutine}
            onPressRoutineListItem={(id) => {
              router.push({
                pathname: '/routine/routineDetail',
                params: { routineId: id },
              })
            }}
          />
        )}
      />
      <SlideModalUI
        isVisible={isVisible}
        setVisible={setIsVisible}
        modalTitle="루틴 삭제"
        modalContent={`${routines.find((item) => item.routineId == deleteRoutineId)?.routineName} 루틴을 삭제하시겠습니까?`}
        primaryButtonText="삭제"
        primaryButtonOnPress={onPressDelete}
        secondaryButtonText="취소"
        secondaryButtonOnPress={() => {
          setIsVisible(false)
        }}
      />

      <TouchableOpacity
        onPress={() => {
          router.push({
            pathname: '/routine/createRoutine',
          })
        }}
        className="absolute right-6 bottom-6  w-14 h-14 rounded-full bg-primary items-center justify-center shadow-lg">
        <PlusIcon
          height={30}
          width={30}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  )
}
