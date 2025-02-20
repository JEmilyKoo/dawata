//메인페이지에서 루틴을 보여줌
import { useEffect, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

import { getNowRoutine, getRoutine } from '@/apis/routine'
import { NowRoutine, Play } from '@/types/routine'

import MainPlayItem from './MainPlayItem'

export default function MainPlayList() {
  // 이 페이지의 계획
  // 0. 시작해야 하는 루틴이 없으면 이 페이지는 비활성화
  // 1. 루틴이 시작되면 처음에 있던 첫 행동(Play)과 예상 소요 시간으로 타이머가 시작됨
  // 2. 전의 행동 타이머가 유지되는 동안 다음 행동과 예상 소요 시간을 아래에 표시
  // 3. 타이머가 0이 되면 원래 있던 행동은 사라지고 새로운 행동의 타이머가 시작
  // 4. 이런 식으로 모든 행동이 끝날 때까지 반복
  // 예시: 현재 시간은 15:00, 루틴 시작 시간은 15:30, 루틴의 첫 행동은 샤워하기 00:15, 다음은 옷 갈아입기 00:05

  const [routineId, setRoutineId] = useState<number | null>(null)
  const [routineStartTime, setRoutineStartTime] = useState<string | null>(null)
  const [playList, setPlayList] = useState<Play[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [currentPlayIndex, setCurrentPlayIndex] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [nowRoutine, setNowRoutine] = useState<NowRoutine | null>(null)

  useEffect(() => {
    const fetchNowRoutine = async () => {
      const nowRoutine = await getNowRoutine()
      setNowRoutine(nowRoutine)
    }
    fetchNowRoutine()
  }, [])

  useEffect(() => {
    if (nowRoutine) {
      setRoutineId(nowRoutine.routineId)
      setRoutineStartTime(nowRoutine.routineStartTime)
    }
  }, [nowRoutine])

  useEffect(() => {
    const fetchRoutine = async () => {
      if (routineId) {
        const routine = await getRoutine(routineId)
        setPlayList(routine.playList)
      }
    }
    fetchRoutine()
  }, [routineId])

  useEffect(() => {
    // 1초마다 현재 시간을 갱신
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (routineStartTime && playList.length > 0) {
      // playList가 있을 때만 실행
      const startDate = new Date(routineStartTime)
      const timeDiff = Math.floor(
        (startDate.getTime() - currentTime.getTime()) / 60000,
      )
      if (timeDiff <= 0) {
        let elapsedTime = -timeDiff
        let accumulatedTime = 0
        let routineEnded = true

        for (let i = 0; i < playList.length; i++) {
          accumulatedTime += playList[i].spendTime
          if (elapsedTime < accumulatedTime) {
            setCurrentPlayIndex(i)
            setTimeLeft(accumulatedTime - elapsedTime)
            routineEnded = false
            break
          }
        }

        if (routineEnded) {
          setTimeLeft(null)
          setCurrentPlayIndex(null)
          setPlayList([])
          setNowRoutine(null)
          setRoutineId(null)
          setRoutineStartTime(null)
        }
      }
    }
  }, [currentTime, playList, routineStartTime])

  // 루틴이 시작되지 않았거나 루틴의 시간이 지났으면 아무것도 표시하지 않음
  if (
    (routineStartTime &&
      new Date(routineStartTime).getTime() > currentTime.getTime()) ||
    timeLeft === null
  ) {
    return null
  }

  // timeLeft를 HH:MM 형식으로 변환하는 함수 추가
  const formatTimeLeft = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
  }

  return (
    <View>
      <View>
        {playList.map((play, index) => (
          <MainPlayItem
            key={play.playId}
            play={play}
            isCurrentPlay={index === currentPlayIndex}
            isNextPlay={index > (currentPlayIndex || 0)}
            timeLeft={timeLeft ? formatTimeLeft(timeLeft) : ''}
            spendTime={play.spendTime ? formatTimeLeft(play.spendTime) : ''}
          />
        ))}
      </View>
    </View>
  )
}
