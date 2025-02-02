// /src/pages/complete.tsx
import { Button, Text, TouchableOpacity, View } from "react-native"
import { useSelector } from "react-redux"

import { useRouter } from "expo-router"

const AppointmentCreate4 = () => {
  const router = useRouter()
  const { promiseName, category, dateTime, participants } = useSelector(
    (state) => state.appointment,
  ) // Redux store에서 모든 데이터 가져오기

  const onSubmit = () => {
    console.log("약속 이름:", promiseName)
    console.log("카테고리:", category)
    console.log("날짜와 시간:", dateTime.date, dateTime.time)
    console.log("참여자들:", participants)
    // 완료 후 홈 화면으로 이동하거나 다른 작업을 할 수 있습니다.
    router.push("/main")
  }

  return (
    <View className="flex-1 p-4">
      <Text className="text-xl font-bold mb-2">
        약속이 성공적으로 생성되었습니다!
      </Text>
      <TouchableOpacity
        className="bg-primary p-2 rounded"
        onPress={onSubmit}>
        <Text className="text-white text-center">홈으로 가기</Text>
      </TouchableOpacity>
    </View>
  )
}

export default AppointmentCreate4
