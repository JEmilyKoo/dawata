import { Text, TouchableOpacity, View } from 'react-native'

import { router, useLocalSearchParams } from 'expo-router'

const AppointmentUpdate2 = () => {
  const { id } = useLocalSearchParams()
  console.log('🦖🦖 id:', id)
  return (
    <View className="flex-1 items-center justify-center">
      <Text>약속 수정 2</Text>
      {/* TODO: 약속 수정 2 페이지 구현 */}
      {/* 이전 버튼 */}
      <TouchableOpacity onPress={() => router.back()}>
        <Text>이전</Text>
      </TouchableOpacity>
      {/* 완료 버튼 */}
      <TouchableOpacity onPress={() => router.replace('/appointment')}>
        <Text>완료</Text>
      </TouchableOpacity>
    </View>
  )
}

export default AppointmentUpdate2
