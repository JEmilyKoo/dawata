import { Image, Text, View } from 'react-native'

const ProfileHeader = () => {
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
        </View>
      </View>
    </View>
  )
}

export default ProfileHeader
