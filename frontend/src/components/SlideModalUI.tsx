import { Text, TouchableOpacity, View } from 'react-native'
import Modal from 'react-native-modal'

interface SlideModalUIProps {
  modalTitle: string
  modalContent: string
  primaryButtonText: string
  primaryButtonOnPress: () => void
  secondaryButtonText: string
  secondaryButtonOnPress: () => void
  isVisible: boolean
  setVisible: (isVisible: boolean) => void
}

const SlideModal = ({
  modalTitle,
  modalContent,
  primaryButtonText,
  primaryButtonOnPress,
  secondaryButtonText,
  secondaryButtonOnPress,
  isVisible,
  setVisible,
}: SlideModalUIProps) => {
  const toggleModal = () => {
    setVisible(!isVisible)
  }

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={toggleModal}
      swipeDirection="down"
      onSwipeComplete={toggleModal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropColor="black"
      backdropOpacity={0.5}
      style={{
        margin: 0,
        marginBottom: -3,
        justifyContent: 'flex-end',
        overflow: 'hidden',
      }}>
      <View className="w-full p-5 bg-white rounded-lg items-center">
        <Text className="w-80 text-center text-lg font-medium text-text-primary">
          {modalTitle}
        </Text>
        <Text className="w-80 text-center text-sm font-regular text-text-secondary">
          {modalContent}
        </Text>

        {primaryButtonText && (
          <TouchableOpacity
            className="w-80 mt-4 px-4 py-4 bg-primary rounded-full"
            onPress={primaryButtonOnPress}>
            <Text className="text-white text-center font-bold">
              {primaryButtonText}
            </Text>
          </TouchableOpacity>
        )}
        {secondaryButtonText && (
          <TouchableOpacity
            className="w-80 mt-4 px-4 py-4 mb-4 border border-primary rounded-full"
            onPress={secondaryButtonOnPress}>
            <Text className="text-primary text-center text-primary font-bold">
              {secondaryButtonText}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  )
}

export default SlideModal
