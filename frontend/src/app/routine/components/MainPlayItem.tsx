// 메인 페이지에서 루틴을 보여주는 용도의 컴포넌트 안에 있는 아이템
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

import { Play } from '@/types/routine'

interface MainPlayItemProps {
  play: Play
  isCurrentPlay: boolean
  isNextPlay: boolean
  timeLeft: string
  spendTime: string
}

export default function MainPlayItem({
  play,
  isCurrentPlay,
  isNextPlay,
  timeLeft,
  spendTime,
}: MainPlayItemProps) {
  return (
    <View>
      {isCurrentPlay && (
        <View>
          <Text className="font-bold text-2xl">{play.playName}</Text>
          <Text className="font-bold text-2xl">{timeLeft}</Text>
        </View>
      )}
      {isNextPlay && (
        <View>
          <Text>{play.playName}</Text>
          <Text>{spendTime}</Text>
        </View>
      )}
    </View>
  )
}
