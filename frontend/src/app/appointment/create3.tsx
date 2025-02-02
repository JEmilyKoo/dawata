import { Button, Text, TouchableOpacity, View } from "react-native"
import { useDispatch, useSelector } from "react-redux"

import CheckBox from "expo-checkbox"
// 액션 import
import { useRouter } from "expo-router"

// Redux 상태 관리
import { setParticipants } from "../../store/slices/appointmentSlice"

// expo-checkbox로 교체

const AppointmentCreate3 = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  // Redux store에서 이전에 입력한 데이터 가져오기
  const { participants } = useSelector((state) => state.appointment)

  const onSubmit = () => {
    // 참여자 데이터를 Redux에 저장
    dispatch(setParticipants(participants))
    router.push("/appointment/create4") // Step4로 이동
  }

  const handleCheckboxChange = (value: string) => {
    if (participants.includes(value)) {
      dispatch(setParticipants(participants.filter((v) => v !== value))) // 이미 선택된 참여자는 제거
    } else {
      dispatch(setParticipants([...participants, value])) // 선택되지 않은 참여자는 추가
    }
  }

  return (
    <View className="flex-1 p-4">
      <Text className="text-xl font-bold mb-2">참여자를 선택해주세요</Text>

      {/* 참여자 선택 체크박스 */}
      <View className="flex-row items-center">
        <CheckBox
          value={participants.includes("user1")}
          onValueChange={() => handleCheckboxChange("user1")}
        />
        <Text>최혁규</Text>
      </View>

      <View className="flex-row items-center">
        <CheckBox
          value={participants.includes("user2")}
          onValueChange={() => handleCheckboxChange("user2")}
        />
        <Text>이준호</Text>
      </View>

      {/* 추가적인 참여자들 */}
      <TouchableOpacity
        className="bg-primary p-2 rounded"
        onPress={onSubmit}>
        <Text className="text-white text-center">다음</Text>
      </TouchableOpacity>
    </View>
  )
}

export default AppointmentCreate3
