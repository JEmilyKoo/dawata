import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'expo-router'
import { ErrorModalButtonTypes } from '@/constants/errors'
import { setErrorModalVisible } from '@/store/slices/errorModalSlice'
import { RootState } from '@/store/store'
import { ErrorModalButtonType } from '@/types/errors'

export const useErrorModal = () => {
  const { t } = useTranslation()
  const router = useRouter()

  const dispatch = useDispatch()
  const { errorModal } = useSelector((state: RootState) => state)

  const [primaryButtonText, setPrimaryButtonText] = useState('')
  const [secondaryButtonText, setSecondaryButtonText] = useState('')

  const primaryButtonOnPress = () => 
    onPressButton(errorModal.primaryButtonType)

  const secondaryButtonOnPress = () =>
    onPressButton(errorModal.secondaryButtonType)

  const onPressButton = (buttonType: ErrorModalButtonType | null) => {
    if (!buttonType) return
    switch (buttonType) {
      case ErrorModalButtonTypes.goToHome:
        router.push('/(tabs)/main')
        break
      case ErrorModalButtonTypes.confirm:
      default:
        break
    }
    dispatch(setErrorModalVisible(false))
  }

  useEffect(() => {
    let text = errorModal.primaryButtonType
      ? t(errorModal.primaryButtonType)
      : ''
    setPrimaryButtonText(text)
  }, [errorModal.primaryButtonType])

  useEffect(() => {
    let text = errorModal.secondaryButtonType
      ? t(errorModal.secondaryButtonType)
      : ''
    setSecondaryButtonText(text)
  }, [errorModal.secondaryButtonType])

  const setVisible = (modalVisible: boolean) => {
    dispatch(setErrorModalVisible(modalVisible))
  }

  return {
    modalTitle: t(errorModal.modalTitle),
    modalContent: t(errorModal.modalContent),
    primaryButtonText,
    primaryButtonOnPress,
    secondaryButtonText,
    secondaryButtonOnPress,
    isVisible: errorModal.isVisible,
    setVisible,
  }
}
