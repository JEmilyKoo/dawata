import { Stack, usePathname } from 'expo-router'

import TabBar from '@/components/TabBar'

export default function ClubLayout() {
  const pathname = usePathname()
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="create1"
          options={{
            title: '그룹 생성',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="main"
        />
        <Stack.Screen
          name="list"
        />
      </Stack>
      {pathname.indexOf('create') == -1 && <TabBar />}
    </>
  )
}
