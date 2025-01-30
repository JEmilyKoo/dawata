import { Stack } from "expo-router"

import TabBar from "@/components/TabBar"

export default function ClubLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="create"
          options={{
            headerShown: true,
            title: "그룹 생성",
            headerShadowVisible: false,
            presentation: "modal", // 모달로 표시하면 탭이 자동으로 숨겨짐
          }}
        />
        <Stack.Screen name="main" />
      </Stack>
      <TabBar />
    </>
  )
}
