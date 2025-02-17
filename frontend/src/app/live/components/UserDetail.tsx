import { Image, Text, TouchableOpacity, View } from 'react-native'

interface User {
  id: string
  name: string
  avatar: string
  details: {
    lastActive: string
  }
}

export const UserDetail = ({ user }: { user: User }) => {
  return (
    <View className="flex-row items-center p-4 bg-gray-100 rounded-2xl mt-5">
      <Image
        source={user.avatar}
        className="w-16 h-16 rounded-full"
      />
      <View className="flex-1 ml-3">
        <Text className="text-lg font-semibold">{user.name}</Text>
        <Text className="text-sm text-gray-500">{user.details.lastActive}</Text>
      </View>
      <View className="flex-row gap-2">
        <TouchableOpacity className="p-2 bg-gray-300 rounded-xl">
          <Text>채팅</Text>
        </TouchableOpacity>
        <TouchableOpacity className="p-2 bg-gray-300 rounded-xl">
          <Text>전화걸기</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default UserDetail
