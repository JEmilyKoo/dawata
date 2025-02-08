import { Text, TouchableOpacity, View } from "react-native"
import { useDispatch, useSelector } from "react-redux"

import CheckBox from "expo-checkbox"
// 액션 import
import { useRouter } from "expo-router"

// Redux 상태 관리
import {  setCreateMemberIds } from "../../store/slices/appointmentSlice"
import { RootState } from "@/store/store"
import { useTranslation } from "react-i18next"
import { createAppointment } from "@/apis/appointment"
const AppointmentCreate3 = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const router = useRouter()

  const { create } = useSelector((state: RootState) => state.appointment) // Redux store에서 모든 데이터 가져오기
  const memberIds = create.memberIds;

  const onSubmit = async () => {
    dispatch(setCreateMemberIds(memberIds))
    const result = await createAppointment(create)
    console.log("result가 빈 배열이 나와야 함", result)
    router.push("/appointment/create4")
  }


  const handleCheckboxChange = (value: number) => {
    if (memberIds.includes(value)) {
      dispatch(setCreateMemberIds(memberIds.filter((v) => v !== value))) // 이미 선택된 참여자는 제거
    } else {
      dispatch(setCreateMemberIds([...memberIds, value])) // 선택되지 않은 참여자는 추가
    }
  }
  const onPressNext = () => {
    onSubmit()
    router.push('/appointment/create4')
  }
  const onPressPrev = () => {
    onSubmit()
    router.push('/appointment/create2')
  }

      // TODO: 약속 메인 페이지가 아니라, 각기 개별 그룹 페이지에서 약속을 생성하게 수정해야 함.
      // TODO: 참여자를 불러온다는 가정 하에 UI 작성 필요
  return (
    <View className="flex-1 p-4">
      <Text className="text-xl font-bold mb-2">참여자를 선택해주세요</Text>
      {/* 참여자 선택 체크박스 */}
      <View className="flex-row items-center">
        <CheckBox
          value={memberIds.includes(1)}
          onValueChange={() => handleCheckboxChange(1)}
        />
        <Text>최혁규</Text>
      </View>

      <View className="flex-row items-center">
        <CheckBox
          value={memberIds.includes(2)}
          onValueChange={() => handleCheckboxChange(2)}
        />
        <Text>이준호</Text>
      </View>

      {/* 추가적인 참여자들 */}
      <View className="flex-row justify-between space-x-2">
        <TouchableOpacity
          className="bg-bord p-2 rounded w-1/4"
          onPress={onPressPrev}>
          <Text className="text-text-primary text-center font-bold">{t('prev')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-primary p-2 rounded w-3/4"
          onPress={onPressNext}>
          <Text className="text-white text-center font-bold">{t('next')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default AppointmentCreate3
