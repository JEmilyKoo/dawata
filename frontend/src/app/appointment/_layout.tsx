import { Stack, usePathname } from 'expo-router'

import TabBar from '@/components/TabBar'

export default function AppointmentLayout() {
  const pathname = usePathname()
  return (
    <>
      <Stack screenOptions={{ headerShown: false, statusBarStyle: 'dark' }}>
        <Stack.Screen
          name="create1"
          options={{
            title: '약속 생성',
          }}
        />
        <Stack.Screen
          name="create2"
          options={{
            title: '약속 생성',
          }}
        />
        <Stack.Screen
          name="create3"
          options={{
            title: '약속 생성',
          }}
        />
        <Stack.Screen
          name="create4"
          options={{
            title: '약속 생성',
          }}
        />
        <Stack.Screen name="detail" />
      </Stack>
      {pathname.indexOf('create') == -1 && pathname.indexOf('update') == -1 && (
        <TabBar />
      )}
    </>
  )
}
