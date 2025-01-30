import { Controller, useForm } from "react-hook-form"
import { Button, Text, TextInput, TouchableOpacity, View } from "react-native"
import { useDispatch } from "react-redux"

import { Picker } from "@react-native-picker/picker"
// 액션 import
import { useRouter } from "expo-router"

// dispatch 사용
import {
  setCategory,
  setPromiseName,
} from "../../store/slices/appointmentSlice"

const AppointmentCreate1 = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const dispatch = useDispatch()
  const router = useRouter()

  const onSubmit = (data: any) => {
    dispatch(setPromiseName(data.promiseName)) // Redux store에 약속 이름 저장
    dispatch(setCategory(data.category)) // Redux store에 카테고리 저장
    router.push("/appointment/create2") // Step2로 이동
  }

  return (
    <View className="flex-1 p-4">
      <Text className="text-xl font-bold mb-2">약속 이름을 설정해주세요</Text>
      <Controller
        control={control}
        name="promiseName"
        rules={{ required: "약속 이름은 필수입니다." }}
        render={({ field }) => (
          <TextInput
            placeholder="약속 이름을 입력하세요"
            className="border-b-2 mb-4"
            {...field}
          />
        )}
      />
      {errors.promiseName && (
        <Text className="text-red-500">{errors.promiseName.message}</Text>
      )}

      <Text className="text-xl font-bold mb-2">
        약속 카테고리를 설정해주세요
      </Text>
      <Controller
        control={control}
        name="category"
        render={({ field }) => (
          <Picker
            selectedValue={field.value}
            onValueChange={field.onChange}
            className="border-2 p-2 mb-4">
            <Picker.Item
              label="카테고리를 선택해주세요"
              value=""
            />
            <Picker.Item
              label="스터디"
              value="study"
            />
            <Picker.Item
              label="스포츠"
              value="sports"
            />
            <Picker.Item
              label="친목"
              value="social"
            />
            <Picker.Item
              label="동아리"
              value="club"
            />
            <Picker.Item
              label="기타"
              value="other"
            />
          </Picker>
        )}
      />
      <TouchableOpacity
        className="bg-primary p-2 rounded"
        onPress={handleSubmit(onSubmit)}>
        <Text className="text-white text-center">다음</Text>
      </TouchableOpacity>
    </View>
  )
}

export default AppointmentCreate1
