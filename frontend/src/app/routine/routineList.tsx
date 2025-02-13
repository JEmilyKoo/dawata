// 루틴 리스트
import { useState } from 'react'
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { useRouter } from 'expo-router'

import RoutineListItem from '@/app/routine/components/RoutineListItem'
import PlusIcon from '@/assets/icons/plus.svg'
import BackButton from '@/components/BackButton'
import SlideModalUI from '@/components/SlideModalUI'

interface Routine {
  routineId: number
  routineName: string
  totalTime: number
}

const routineTemplateList: Routine[] = [
  { routineId: 1, routineName: '밥먹기', totalTime: 20 },
  { routineId: 2, routineName: '준비 10분 컷', totalTime: 10 },
  { routineId: 3, routineName: '여유롭게 준비', totalTime: 30 },
  { routineId: 4, routineName: '풀 메이크업', totalTime: 60 },
]

export default function RoutineList() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [deleteRoutineId, setDeleteRoutineId] = useState(0)
  const deleteRoutine = (routineId: number) => {
    setDeleteRoutineId(routineId)
    setIsVisible(true)
  }

  const onPressDelete = () => {
    console.log('삭제해야 하는 id', deleteRoutineId)
  }

  return (
    <View className="flex-1 bg-white p-4">
      <View className="flex-row pb-2 border-b border-bord">
        <BackButton />
        <View className="flex-1 mt-2">
          <Text className="text-xl font-bold">내 루틴 목록</Text>
        </View>
      </View>
      <FlatList
        data={routineTemplateList}
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
        modalContent={`${routineTemplateList.find((item) => item.routineId == deleteRoutineId)?.routineName} 루틴을 삭제하시겠습니까?`}
        primaryButtonText="삭제"
        primaryButtonOnPress={onPressDelete}
        secondaryButtonText="취소"
        secondaryButtonOnPress={() => {
          console.log('취소')
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
