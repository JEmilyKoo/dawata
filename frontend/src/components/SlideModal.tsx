import React, { useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import Modal from "react-native-modal"

interface SlideModalProps {
  modalButton: React.ReactElement // 부모로부터 전달받을 버튼
  modalTitle: string
  modalContent: string
  primaryButtonText: string
  primaryButtonOnPress: () => void
  secondaryButtonText: string
  secondaryButtonOnPress: () => void
}

const SlideModal: React.FC<SlideModalProps> = ({
  modalButton,
  modalTitle,
  modalContent,
  primaryButtonText,
  primaryButtonOnPress,
  secondaryButtonText,
  secondaryButtonOnPress,
}: SlideModalProps) => {
  const [modalVisible, setModalVisible] = useState(false)

  const toggleModal = () => {
    setModalVisible(!modalVisible)
  }

  // 부모로부터 전달받은 modalButton에 onPress 덮어씌우기
  const modalButtonWithToggle = React.cloneElement(modalButton, {
    onPress: () => {
      toggleModal()
      if (modalButton.props.onPress) {
        modalButton.props.onPress() // 부모에서 전달된 onPress 호출
      }
    },
  })

  return (
    <View className="flex-1 justify-center items-center">
      {modalButtonWithToggle}

      <Modal
        isVisible={modalVisible}
        onBackdropPress={toggleModal}
        swipeDirection="down"
        onSwipeComplete={toggleModal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropColor="black"
        backdropOpacity={0.5}
        style={{ margin: 0, justifyContent: "flex-end" }}>
        <View className="w-full p-5 bg-white rounded-lg items-center">
          <Text className="w-80 text-center text-lg font-medium text-text-primary">
            {modalTitle}
          </Text>
          <Text className="w-80 text-center text-sm font-regular text-text-secondary">
            {modalContent}
          </Text>

          <TouchableOpacity
            className="w-80 mt-4 px-4 py-4 bg-primary rounded-full"
            onPress={primaryButtonOnPress}>
            <Text className="text-white text-center font-bold">
              {primaryButtonText}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-80 mt-4 px-4 py-4 mb-4 border border-primary rounded-full"
            onPress={secondaryButtonOnPress}>
            <Text className="text-primary text-center text-primary font-bold">
              {secondaryButtonText}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
}

export default SlideModal
