import { Image, Platform, Text, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux'

import { router } from 'expo-router'

import CameraIcon from '@/assets/icons/camera.svg'
import { RootState } from '@/store/store'

const ProfileHeader = () => {
  const { user } = useSelector((state: RootState) => state.member)
  const uploadImg = () => {
    if (Platform.OS === 'web') {
      router.push({
        pathname: '/profile/uploadImg',
        params: { memberId: user.id },
      })
    } else {
      console.log('uploadImg')
    }
  }
  return (
    <View>
      <View className="flex-row justify-between p-4">
        <View>
          <Text className="text-lg font-bold">최혁규</Text>
          <Text className="text-sm text-gray-600">huk9uri@email.com</Text>
        </View>
        <View>
          <Image
            source={require('@/assets/avatars/user1.png')}
            style={{ width: 72, height: 72 }}
          />

          <TouchableOpacity onPress={uploadImg}>
            <CameraIcon
              width={18}
              height={18}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default ProfileHeader
