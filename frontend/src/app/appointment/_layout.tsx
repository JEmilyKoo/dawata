import { Stack } from "expo-router"

import TabBar from "@/components/TabBar"

export default function AppointmentLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="create1"
          options={{
            headerShown: true,
            title: "약속 생성",
            headerShadowVisible: false,
            presentation: "modal", // 모달로 표시하면 탭이 자동으로 숨겨짐
          }}
        />
        <Stack.Screen name="create2" />
        <Stack.Screen name="create3" />
        <Stack.Screen name="create4" />
        <Stack.Screen name="detail" />
      </Stack>
      <TabBar />
    </>
  )
}
