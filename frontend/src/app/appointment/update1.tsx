import { Text, TouchableOpacity, View } from 'react-native'

import { router, useLocalSearchParams } from 'expo-router'

const AppointmentUpdate1 = () => {
  const { id } = useLocalSearchParams()
  console.log('🦖🦖 id:', id)
  return (
    <View className="flex-1 items-center justify-center">
      <Text>약속 수정</Text>
      {/* TODO: 약속 수정 1 페이지 구현 */}
      {/* 다음 버튼 */}
      <TouchableOpacity
        onPress={() => router.push(`/appointment/update2?id=${id}`)}>
        <Text>다음</Text>
      </TouchableOpacity>
    </View>
  )
}

export default AppointmentUpdate1
