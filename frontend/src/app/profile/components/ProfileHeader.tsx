import { Image, Platform, Text, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux'

import { router } from 'expo-router'

import BellIcon from '@/assets/icons/bell.svg'
import CameraIcon from '@/assets/icons/camera.svg'
import SettingsIcon from '@/assets/icons/settings.svg'
import BackButton from '@/components/BackButton'
import ImageThumbnail from '@/components/ImageThumbnail'
import { RootState } from '@/store/store'

const ProfileHeader = () => {
  const { user } = useSelector((state: RootState) => state.member)
  const uploadImg = () => {
    if (Platform.OS === 'web') {
      router.push({
        pathname: '/profile/uploadImg',
        params: { memberId: user.memberId },
      })
    } else {
      console.log('uploadImg')
    }
  }
  return (
    <View>
      <View className="flex-col justify-between p-4">
        <View className="flex-row justify-between">
          <BackButton />
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: '/profile/editProfile',
                })
              }}>
              <SettingsIcon
                width={24}
                height={24}
              />
            </TouchableOpacity>
            <BellIcon
              width={24}
              height={24}
            />
          </View>
        </View>
        <View className="flex-row justify-between">
          <View>
            <Text className="text-lg font-bold">{user.name}</Text>
            <Text className="text-sm text-gray-600">{user.email}</Text>
          </View>
          <View>
            <ImageThumbnail
              img={user.img}
              className="w-16 h-16 rounded-full"
              width={72}
              height={72}
              defaultImg={user.img}
            />

            <TouchableOpacity
              onPress={uploadImg}
              className="absolute bottom-0 right-0 rounded-full bg-white p-1 border border-bord">
              <CameraIcon
                width={18}
                height={18}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

export default ProfileHeader
