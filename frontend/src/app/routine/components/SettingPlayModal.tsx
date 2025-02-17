//행동 수정 및 추가하는 모달
import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import Modal from 'react-native-modal'

import PlayMinusIcon from '@/assets/icons/play-minus.svg'
import PlayPlusIcon from '@/assets/icons/play-plus.svg'
import { Play } from '@/types/routine'

interface SettingPlayModalProps {
  isVisible: boolean
  playId: number
  setIsVisible: (isVisible: boolean) => void
  playList: Play[]
  setPlayList: (playList: Play[]) => void
  isCreate: boolean
  setIsCreate: (isCreate: boolean) => void
  totalTime: number
  setTotalTime: (totalTime: number) => void
}

export default function SettingPlayModal({
  playList,
  setPlayList,
  isVisible,
  playId,
  setIsVisible,
  isCreate,
  setIsCreate,
  totalTime,
  setTotalTime,
}: SettingPlayModalProps) {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      playName: '',
      spendTime: 1,
    },
  })
  const primaryButtonTextList = useMemo(() => ['추가', '수정'], [])
  const [primaryButtonText, setPrimaryButtonText] = useState(
    primaryButtonTextList[0],
  )

  // useEffect(() => {
  //   setIsCreate(playId == 0)
  // }, [playId])

  useEffect(() => {
    if (isVisible) {
      // 모달이 열릴 때
      resetSettingPlayModal() // 먼저 초기화

      if (!isCreate) {
        // 수정 모드일 경우에만
        const selectedPlay = playList.find((play) => play.playId === playId)
        if (selectedPlay) {
          setValue('playName', selectedPlay.playName)
          setValue('spendTime', selectedPlay.spendTime)
        }
        setPrimaryButtonText(primaryButtonTextList[1])
      } else {
        setPrimaryButtonText(primaryButtonTextList[0])
      }
    }
  }, [isVisible, isCreate, playId, setValue])
  const toggleModal = () => {
    setIsVisible(!isVisible)
  }
  const spendTime = watch('spendTime')

  const adjustTime = (amount: number) => {
    setValue('spendTime', Math.max(1, spendTime + amount))
  }

  const resetSettingPlayModal = () => {
    setValue('spendTime', 1)
    setValue('playName', '')
  }

  // 최대 playId를 추적하는 state 추가
  const [nextPlayId, setNextPlayId] = useState(() => {
    const maxId = playList.reduce((max, play) => Math.max(max, play.playId), 0)
    return maxId + 1
  })

  const onSubmit = (data: { playName: string; spendTime: number }) => {
    if (isCreate) {
      const newPlay: Play = {
        playId: nextPlayId, // length + 1 대신 nextPlayId 사용
        playName: data.playName,
        spendTime: data.spendTime,
      }
      setPlayList([...playList, newPlay])
      setNextPlayId(nextPlayId + 1) // 다음 ID 준비
    } else {
      const updatedPlayList = playList.map((play) =>
        play.playId === playId
          ? { ...play, playName: data.playName, spendTime: data.spendTime }
          : play,
      )
      setPlayList(updatedPlayList)
      console.log('행동 수정하는 playName ', data.playName)
      console.log('행동 수정하는 spendTime ', data.spendTime)
      console.log('행동 수정하는 playId ', playId)
    }
    setIsVisible(false)
  }
  const secondaryButtonOnPress = () => {
    setIsVisible(false)
  }
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={toggleModal}
      swipeDirection="down"
      onSwipeComplete={toggleModal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropColor="black"
      backdropOpacity={0.5}
      style={{
        margin: 0,
        marginBottom: -3,
        justifyContent: 'flex-end',
        overflow: 'hidden',
      }}>
      <View className="w-full p-5 bg-white rounded-lg items-center">
        <View className="flex-1 bg-white items-center">
          <Text className="text-lg font-bold mb-4">행동</Text>
          <Text className="text-base font-medium mb-2 w-full">이름</Text>
          <Controller
            control={control}
            name="playName"
            rules={{ required: '빈칸이면 안 됩니다' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder={'행동을 입력해주세요'}
                onBlur={onBlur}
                className="w-full p-3 border border-bord rounded-lg mb-4"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.playName && (
            <Text className="text-light-red">{errors.playName.message}</Text>
          )}

          <Text className="text-base font-medium mb-2 w-full">시간</Text>
          <View className="flex-row justify-center gap-4 mb-4">
            <TouchableOpacity
              onPress={() => adjustTime(-10)}
              className="bg-white border border-bord p-3 rounded-full items-center">
              <PlayMinusIcon />
              <Text className="text-text-primary">10분</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => adjustTime(-1)}
              className="bg-white border border-bord p-3 rounded-full items-center">
              <PlayMinusIcon />
              <Text className="text-text-primary">1분</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => adjustTime(1)}
              className="bg-white border border-bord p-3 rounded-full items-center">
              <PlayPlusIcon />
              <Text className="text-text-primary">1분</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => adjustTime(10)}
              className="bg-white border border-bord p-3 rounded-full items-center">
              <PlayPlusIcon />
              <Text className="text-text-primary">10분</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-xl font-bold text-primary">{spendTime}분</Text>
        </View>
        {primaryButtonText && (
          <TouchableOpacity
            className="w-80 mt-4 px-4 py-4 bg-primary rounded-full"
            onPress={handleSubmit(onSubmit)}>
            <Text className="text-white text-center font-bold">
              {primaryButtonText}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          className="w-80 mt-4 px-4 py-4 mb-4 border border-primary rounded-full"
          onPress={secondaryButtonOnPress}>
          <Text className="text-primary text-center text-primary font-bold">
            취소
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}
