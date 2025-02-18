import { TouchableOpacity } from 'react-native'

import { useRouter } from 'expo-router'

import ArrowLeftIcon from '@/assets/icons/chevron-left.svg'

const BackButton = () => {
  const router = useRouter()

  const handlePress = () => {
    router.back()
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{ padding: 10 }}>
      <ArrowLeftIcon
        width="24"
        height="24"
      />
    </TouchableOpacity>
  )
}

export default BackButton
