import { TouchableOpacity, View } from 'react-native'
import { useDispatch } from 'react-redux'

import { useRouter } from 'expo-router'

import PlusIcon from '@/assets/icons/plus.svg'
import SlideModal from '@/components/SlideModal'
import { resetCreate } from '@/store/slices/clubSlice'

const ClubAddModal = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const modalButton = (
    <TouchableOpacity className="w-14 h-14 rounded-full bg-primary items-center justify-center shadow-lg">
      <PlusIcon
        height={30}
        width={30}
        color="#fff"
      />
    </TouchableOpacity>
  )
  const createClub = () => {
    router.navigate('/club/create1')

    dispatch(resetCreate())
  }

  return (
    <View className="flex-1 justify-center items-center">
      <SlideModal
        modalButton={modalButton}
        modalTitle="무엇을 할까요?"
        modalContent="새로운 그룹을 생성하려면 그룹 생성을, 기존 그룹에 참가하려면 그룹 참가를 눌러주세요."
        primaryButtonText="새로운 그룹 생성"
        primaryButtonOnPress={createClub}
        secondaryButtonText="기존 그룹 참가"
        secondaryButtonOnPress={() => console.log('기존 그룹 참가')}
      />
    </View>
  )
}

export default ClubAddModal
