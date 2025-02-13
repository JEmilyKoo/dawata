import { Stack, usePathname } from 'expo-router'

import TabBar from '@/components/TabBar'

export default function ClubLayout() {
  const pathname = usePathname()
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="routineDetail" />
        <Stack.Screen name="routineList" />
        <Stack.Screen
          name="updateRoutine"
          options={{
            title: '루틴 수정',
          }}
        />
        <Stack.Screen
          name="createRoutine"
          options={{
            title: '루틴 추가',
          }}
        />
      </Stack>
      {(pathname.indexOf('create') == -1 ||
        pathname.indexOf('update') == -1) && <TabBar />}
    </>
  )
}
