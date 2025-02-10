import { View } from 'react-native'

import { useRouter } from 'expo-router'

import SlideModalUI from '@/components/SlideModalUI'

const ClubDeleteModal = ({
  isVisible,
  setVisible,
  clubName,
  clubId,
}: {
  isVisible: boolean
  setVisible: (visible: boolean) => void
  clubName: string
  clubId: number
}) => {
  const router = useRouter()
  const onPressCancel = () => {

    setVisible(false)
  }
  const onPressDelete = () => {
    router.navigate('/club/create1')
    setVisible(false)
  }
  return (
    <View className="flex-1 justify-center items-center">
      <SlideModalUI
        isVisible={isVisible}
        setVisible={setVisible}
        modalTitle="그룹 해산"
        modalContent="그룹을 해산하시겠습니까?"
        primaryButtonText="그룹 해산"
        primaryButtonOnPress={onPressDelete}
        secondaryButtonText="취소"
        secondaryButtonOnPress={onPressCancel}
      />
    </View>
  )
}

export default ClubDeleteModal
