import React, { useState } from "react"
// React Native DatePicker
import DatePicker from "react-datepicker"
// 웹용 DatePicker
import "react-datepicker/dist/react-datepicker.css"
import { Button, Platform, Text, TouchableOpacity, View } from "react-native"
import { DatePicker as ReactNativeDatePicker } from "react-native-date-picker"
import { useDispatch, useSelector } from "react-redux"

// 액션 import
import { useRouter } from "expo-router"

// Redux 상태 관리
import { setDateTime } from "../../store/slices/appointmentSlice"

// 스타일 임포트

const AppointmentCreate2 = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { promiseName, category } = useSelector((state) => state.appointment) // Redux에서 이전 데이터 가져오기

  const [date, setDate] = useState(new Date()) // 선택된 날짜 상태
  const [open, setOpen] = useState(false) // React Native DatePicker 열고 닫는 상태

  const handleConfirm = (date: Date) => {
    setDate(date) // 선택한 날짜를 상태로 업데이트
  }

  const onSubmit = () => {
    dispatch(
      setDateTime({
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString(),
      }),
    ) // 선택한 날짜와 시간 Redux에 저장
    router.push("/appointment/create3") // Step3으로 이동
  }

  return (
    <View className="flex-1 p-4">
      <Text className="text-xl font-bold mb-2">
        약속 날짜와 시간을 설정해주세요
      </Text>

      {/* 날짜 선택 */}
      <TouchableOpacity
        className="bg-primary p-2 rounded"
        onPress={() => setOpen(true)}>
        <Text className="text-white text-center">날짜와 시간 선택</Text>
      </TouchableOpacity>

      {/* 플랫폼에 따라 다른 DatePicker 사용 */}
      {Platform.OS === "web" ? (
        <DatePicker
          selected={date}
          onChange={handleConfirm}
          showTimeSelect
          dateFormat="Pp"
        />
      ) : (
        <ReactNativeDatePicker
          modal
          open={open}
          date={date}
          onConfirm={handleConfirm}
          onCancel={() => setOpen(false)}
        />
      )}

      {/* 선택된 날짜와 시간 출력 */}
      <Text className="mb-4">선택된 날짜와 시간: {date.toLocaleString()}</Text>
      <TouchableOpacity
        className="bg-primary p-2 rounded"
        onPress={onSubmit}>
        <Text className="text-white text-center">다음</Text>
      </TouchableOpacity>
    </View>
  )
}

export default AppointmentCreate2
