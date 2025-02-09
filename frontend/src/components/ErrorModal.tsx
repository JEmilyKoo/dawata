import SlideModalUI from '@/components/SlideModalUI'
import { useErrorModal } from '@/hooks/useErrorModal'
import {View , Text} from 'react-native'
const ErrorModal = () => {
  const {
    modalTitle,
    modalContent,
    primaryButtonText,
    primaryButtonOnPress,
    secondaryButtonText,
    secondaryButtonOnPress,
    isVisible,
    setVisible,
  } = useErrorModal()
  return (
    <SlideModalUI
      modalTitle={modalTitle}
      modalContent={modalContent}
      primaryButtonText={primaryButtonText}
      primaryButtonOnPress={primaryButtonOnPress}
      secondaryButtonText={secondaryButtonText}
      secondaryButtonOnPress={secondaryButtonOnPress}
      isVisible={isVisible}
      setVisible={setVisible}
    />
  )
}
export default ErrorModal
