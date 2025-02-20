import { Stack, usePathname } from 'expo-router'

import TabBar from '@/components/TabBar'

export default function ClubLayout() {
  const pathname = usePathname()
  return (
    <>
      <Stack screenOptions={{ headerShown: false, statusBarStyle: 'dark' }}>
        <Stack.Screen name="create1" />
        <Stack.Screen name="main" />
        <Stack.Screen name="list" />
        <Stack.Screen name="memberList" />
        <Stack.Screen name="updateInfo" />
      </Stack>
      {(pathname.indexOf('create') == -1 ||
        pathname.indexOf('update') == -1) && <TabBar />}
    </>
  )
}
