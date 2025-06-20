// 루틴 상세
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { pl } from 'date-fns/locale'
import { useLocalSearchParams, useRouter } from 'expo-router'

import { updateRoutine } from '@/apis/routine'
import SettingPlayItem from '@/app/routine/components/SettingPlayItem'
import BackButton from '@/components/BackButton'
import SlideModalUI from '@/components/SlideModalUI'
import TopHeader from '@/components/TopHeader'
import { RootState } from '@/store/store'
import { Play, RoutineCreate } from '@/types/routine'
import { CreatePlay } from '@/types/routine'

import {
  setCreatePlayList,
  setCreateRoutineName,
} from '../../store/slices/routineSlice'
import SettingPlayModal from './components/SettingPlayModal'

export default function UpdateRoutine() {
  const [isCreate, setIsCreate] = useState(true)
  const [playList, setPlayList] = useState<Play[]>([])
  const [totalTime, setTotalTime] = useState(0)

  const [isVisible, setIsVisible] = useState(false)
  const { t } = useTranslation()
  const router = useRouter()
  const { routineId } = useLocalSearchParams()
  const { create } = useSelector((state: RootState) => state.routine)
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      routineName: create.routineName,
      playList: create.playList,
    },
  })

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
    const response = await updateRoutine(Number(routineId), routine)
    router.push({
      pathname: '/routine/routineList',
    })
  }

  useEffect(() => {
    if (playList.length > 0) {
      clearErrors('playList')
    }
  }, [playList, clearErrors])

  useEffect(() => {
    const initialPlayList = create.playList.map((item: Play) => ({
      playId: item.playId,
      playName: item.playName,
      spendTime: item.spendTime,
    }))
    setPlayList(initialPlayList)
  }, [])

  useEffect(() => {
    setTotalTime(
      playList.reduce((acc: number, cur: Play) => acc + cur.spendTime, 0),
    )
  }, [playList])

  const [isSettingVisible, setIsSettingVisible] = useState(false)
  const [deletePlayId, setDeletePlayId] = useState(0)
  const [settingPlayId, setSettingPlayId] = useState(0)

  const editPlay = (playId: number) => {
    setSettingPlayId(playId)
    setIsCreate(false)
    setIsSettingVisible(true)
  }
  const deletePlay = (playId: number) => {
    setDeletePlayId(playId)
    setIsVisible(true)
  }
  const onPressDelete = () => {
    const updatedPlayList = playList.filter(
      (play) => play.playId !== deletePlayId,
    )
    setPlayList(updatedPlayList)
    setIsVisible(false)
  }
  const onLongPressPlayItem = (playId: number) => {
    console.log('꾹 눌러서 움직여야 할 playd', playId)
  }

  return (
    <View className="flex-1 bg-white pt-4">
      <TopHeader title="루틴 수정" />
      <View className="p-4 justify-between">
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
          <Text className="text-light-red">
            {(errors.routineName as { message: string }).message}
          </Text>
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
          <Text className="text-light-red">
            {(errors.playList as { message: string }).message}
          </Text>
        )}

        <TouchableOpacity
          onPress={() => {
            setSettingPlayId(0)
            setIsCreate(true)
            setIsSettingVisible(true)
          }}
          className="border border-primary p-2 rounded-xl">
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
