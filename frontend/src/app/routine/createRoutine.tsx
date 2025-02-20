// 루틴 상세
// 루틴 리스트
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { useLocalSearchParams, useRouter } from 'expo-router'

import { createRoutine } from '@/apis/routine'
import SettingPlayItem from '@/app/routine/components/SettingPlayItem'
import BackButton from '@/components/BackButton'
import SlideModalUI from '@/components/SlideModalUI'
import { RootState } from '@/store/store'
import { CreatePlay, Play, RoutineCreate } from '@/types/routine'

import {
  setCreatePlayList,
  setCreateRoutineName,
} from '../../store/slices/routineSlice'
import SettingPlayModal from './components/SettingPlayModal'

export default function CreateRoutine() {
  const [isCreate, setIsCreate] = useState(true)
  const [playList, setPlayList] = useState<Play[]>([])
  const [totalTime, setTotalTime] = useState(0)

  const [isVisible, setIsVisible] = useState(false)
  const [isSettingVisible, setIsSettingVisible] = useState(false)
  const [settingPlayId, setSettingPlayId] = useState(0)
  const { t } = useTranslation()
  const router = useRouter()
  const { routineId } = useLocalSearchParams()

  const [deletePlayId, setDeletePlayId] = useState(0)
  const { create } = useSelector((state: RootState) => state.routine)

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      routineName: '',
      playList: [],
    },
  })

  useEffect(() => {
    if (playList.length > 0) {
      clearErrors('playList')
    }
  }, [playList, clearErrors])

  const onPressDelete = () => {
    console.log('삭제해야 하는 id', deletePlayId)
    const updatedPlayList = playList.filter(
      (play) => play.playId !== deletePlayId,
    )
    setPlayList(updatedPlayList)
    setIsVisible(false)
  }
  const deletePlay = (playId: number) => {
    setDeletePlayId(playId)
    setIsVisible(true)
  }
  const onSubmit = async (data: {
    routineName: string
    playList: CreatePlay[]
  }) => {
    if (playList.length === 0) {
      setError('playList', {
        type: 'required',
        message: '행동을 추가해주세요',
      })
      return
    }

    const routine: RoutineCreate = {
      routineName: data.routineName,
      playList: playList,
    }
    const response = await createRoutine(routine)

    router.replace({
      pathname: '/routine/routineList',
    })
  }

  const editPlay = (playId: number) => {
    console.log('수정해야 할 playId', playId)
    setSettingPlayId(playId)
    setIsCreate(false)
    setIsSettingVisible(true)
  }
  const onLongPressPlayItem = (playId: number) => {
    console.log('꾹 눌러서 움직여야 할 playd', playId)
  }

  useEffect(() => {
    setTotalTime(
      playList.reduce((acc: number, cur: Play) => acc + cur.spendTime, 0),
    )
  }, [playList])

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
            deletePlay={deletePlay}
            onLongPressPlayItem={onLongPressPlayItem}
            key={item.playId}
          />
        ))}
        {errors.playList && (
          <Text className="text-light-red">{errors.playList.message}</Text>
        )}

        <TouchableOpacity
          className="border border-primary p-2 rounded-xl"
          onPress={() => {
            setSettingPlayId(0)
            setIsCreate(true)
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
        playList={playList}
        setPlayList={setPlayList}
        isCreate={isCreate}
        setIsCreate={setIsCreate}
        totalTime={totalTime}
        setTotalTime={setTotalTime}
      />
      <TouchableOpacity
        className="bg-primary p-2 rounded"
        onPress={handleSubmit(onSubmit)}>
        <Text className="text-white text-center font-bold">{t('finish')}</Text>
      </TouchableOpacity>
    </View>
  )
}
