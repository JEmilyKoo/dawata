import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useDispatch } from 'react-redux'

import { useRouter } from 'expo-router'

import { deleteClub } from '@/apis/club'
import { useClubMember } from '@/app/club/hooks/useClubMember'
import SlideModalUI from '@/components/SlideModalUI'
import { setErrorModal } from '@/store/slices/errorModalSlice'

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
  const { t } = useTranslation()
  const router = useRouter()
  const { isAdmin } = useClubMember({ clubId })
  const dispatch = useDispatch()
  const onPressDelete = async () => {
    if (isAdmin) {
      const result = await deleteClub({ clubId })
      if (result) {
        router.navigate('/(tabs)/main')
      }
    } else {
      dispatch(
        setErrorModal({
          modalTitle: `error.${403}.title`,
          modalContent: `error.${403}.content`,
          primaryButtonType: 'confirm',
          secondaryButtonType: 'goToHome',
          isVisible: true,
        }),
      )
    }
    setVisible(false)
  }

  const onPressCancel = () => {
    setVisible(false)
  }
  return (
    <View className="flex-1 justify-center items-center">
      <SlideModalUI
        isVisible={isVisible}
        setVisible={setVisible}
        modalTitle={t('club.deleteClub')}
        modalContent={t('deleteClub.title', { val: clubName })}
        primaryButtonText={t('club.deleteClub')}
        primaryButtonOnPress={onPressDelete}
        secondaryButtonText={t('cancel')}
        secondaryButtonOnPress={onPressCancel}
      />
    </View>
  )
}
export default ClubDeleteModal
