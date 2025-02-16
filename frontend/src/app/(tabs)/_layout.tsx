import { Stack, usePathname } from 'expo-router'

import TabBar from '@/components/TabBar'

export default function TabLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}></Stack>
      <TabBar />
    </>
  )
}
