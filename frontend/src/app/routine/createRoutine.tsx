// 루틴 상세
// 루틴 리스트
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { useLocalSearchParams, useRouter } from 'expo-router'

import SettingPlayItem from '@/app/routine/components/SettingPlayItem'
import BackButton from '@/components/BackButton'
import SlideModalUI from '@/components/SlideModalUI'
import { RootState } from '@/store/store'

import {
  setCreatePlayList,
  setCreateRoutineName,
} from '../../store/slices/routineSlice'
import SettingPlayModal from './components/SettingPlayModal'

const playList = [
  { playId: 1, playName: '머리만 감기', spendTime: 5 },
  { playId: 2, playName: '샤워', spendTime: 20 },
  { playId: 3, playName: '옷 갈아입기', spendTime: 5 },
]

export default function CreateRoutine() {
  const totalTime = 30

  const [isVisible, setIsVisible] = useState(false)
  const [isSettingVisible, setIsSettingVisible] = useState(false)
  const [settingPlayId, setSettingPlayId] = useState(0)
  const { t } = useTranslation()
  const router = useRouter()
  const { routineId } = useLocalSearchParams()

  const [deletePlayId, setDeletePlayId] = useState(0)
  const { create } = useSelector((state: RootState) => state.routine)
  interface CreatePlay {
    playName: string
    spendTime: number
  }
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      routineName: '',
      playList: [],
    },
  })
  const onPressDelete = () => {
    console.log('삭제해야 하는 id', deletePlayId)
  }
  const deletePlay = (playId: number) => {
    setDeletePlayId(playId)
    setIsVisible(true)
  }
  const onSubmit = (data: { routineName: string; playList: CreatePlay[] }) => {
    dispatch(setCreateRoutineName(data.routineName))
    dispatch(setCreatePlayList(data.playList))
    // playlist 수정하는 것은 별도로 구현할 것

    router.push({
      pathname: '/routine/routineList',
    })
  }

  const editPlay = (playId: number) => {
    console.log('수정해야 할 playId', playId)
    setSettingPlayId(playId)
    setIsSettingVisible(true)
  }
  const onLongPressPlayItem = (playId: number) => {
    console.log('꾹 눌러서 움직여야 할 playd', playId)
  }

  const dispatch = useDispatch()
  return (
    <View className="flex-1 bg-white p-4 justify-between">
      <View>
        <View className="flex-row pb-2 border-b border-bord">
          <BackButton />
          <View className="flex-1 mt-2">
            <Text className="text-xl font-bold">루틴 추가</Text>
          </View>
        </View>
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold">루틴이름을 설정해주세요</Text>
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: '/routine/updateRoutine',
                params: { routineId },
              })
            }}></TouchableOpacity>
        </View>
        <Controller
          control={control}
          name="routineName"
          rules={{ required: '빈칸이면 안 됩니다' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder={'루틴이름을 입력해주세요'}
              onBlur={onBlur}
              className="border-b-2 mb-4 border-primary"
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.routineName && (
          <Text className="text-light-red">{errors.routineName.message}</Text>
        )}
        <Text className="text-lg font-bold">행동을 설정해주세요</Text>
        {playList.map((item) => (
          <SettingPlayItem
            playId={item.playId}
            playName={item.playName}
            spendTime={item.spendTime}
            editPlay={editPlay}
            deltePlay={deletePlay}
            onLongPressPlayItem={onLongPressPlayItem}
            key={item.playId}
          />
        ))}

        <TouchableOpacity
          className="border border-primary p-2 rounded-xl"
          onPress={() => {
            setSettingPlayId(0)
            setIsSettingVisible(true)
          }}>
          <Text className="text-primary text-center font-bold">
            + 행동 추가하기
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-between items-center mt-3">
          <Text className="text-base font-medium ">예상 소요 시간</Text>
          <Text className="text-xl font-bold text-primary">{totalTime}분</Text>
        </View>
      </View>

      <SlideModalUI
        isVisible={isVisible}
        setVisible={setIsVisible}
        modalTitle="행동 삭제"
        modalContent={`${playList.find((item) => item.playId == deletePlayId)?.playName} 행동을 삭제하시겠습니까?`}
        primaryButtonText="삭제"
        primaryButtonOnPress={onPressDelete}
        secondaryButtonText="취소"
        secondaryButtonOnPress={() => {
          console.log('취소')
          setIsVisible(false)
        }}
      />
      <SettingPlayModal
        isVisible={isSettingVisible}
        playId={settingPlayId}
        setIsVisible={setIsSettingVisible}
      />
      <TouchableOpacity
        className="bg-primary p-2 rounded"
        onPress={handleSubmit(onSubmit)}>
        <Text className="text-white text-center font-bold">{t('finish')}</Text>
      </TouchableOpacity>
    </View>
  )
}
