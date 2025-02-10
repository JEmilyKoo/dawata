import { View } from 'react-native'

import { useRouter } from 'expo-router'

import SlideModalUI from '@/components/SlideModalUI'

const ClubLeaveModal = ({
  isVisible,
  setVisible,
  clubName,
  clubId,
  memberId,
}: {
  isVisible: boolean
  setVisible: (visible: boolean) => void
  clubName: string
  clubId: number
  memberId: number
}) => {
  const router = useRouter()
  const onPressCancel = () => {
    setVisible(false)
  }
  const onPressLeave = () => {
    router.navigate('/club/create1')
    setVisible(false)
  }
  return (
    <View className="flex-1 justify-center items-center">
      <SlideModalUI
        isVisible={isVisible}
        setVisible={setVisible}
        modalTitle="그룹 탈퇴"
        modalContent="그룹을 탈퇴하시겠습니까?"
        primaryButtonText="그룹 탈퇴"
        primaryButtonOnPress={onPressLeave}
        secondaryButtonText="취소"
        secondaryButtonOnPress={onPressCancel}
      />
    </View>
  )
}

export default ClubLeaveModal
