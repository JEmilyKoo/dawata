import { Stack, usePathname } from 'expo-router'

import TabBar from '@/components/TabBar'

export default function ClubLayout() {
  const pathname = usePathname()
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="uploadImg"
          options={{
            title: '프로필 이미지 생성',
            headerShown: true,
          }}
        />
      </Stack>
      {pathname.indexOf('upload') == -1 && <TabBar />}
    </>
  )
}
