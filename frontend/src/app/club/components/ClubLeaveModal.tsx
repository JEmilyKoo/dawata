import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useDispatch } from 'react-redux'

import { useRouter } from 'expo-router'

import { deleteClubMember } from '@/apis/club'
import SlideModalUI from '@/components/SlideModalUI'
import { useClubMember } from '@/hooks/useClubMember'
import { setErrorModal } from '@/store/slices/errorModalSlice'

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
  const { t } = useTranslation()
  const router = useRouter()
  const { isAdmin, isMember } = useClubMember({ clubId })
  const dispatch = useDispatch()

  const onPressLeave = async () => {
    if (!isAdmin && isMember) {
      const result = await deleteClubMember({ clubId, clubMemberId: memberId })
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
        modalTitle={t('club.leaveClub')}
        modalContent={t('leaveClub.title', { val: clubName })}
        primaryButtonText={t('club.leaveClub')}
        primaryButtonOnPress={onPressLeave}
        secondaryButtonText={t('cancel')}
        secondaryButtonOnPress={onPressCancel}
      />
    </View>
  )
}

export default ClubLeaveModal
