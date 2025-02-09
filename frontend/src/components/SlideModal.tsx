import React, { useState } from "react"
import { View } from "react-native"
import SlideModalUI from "@/components/SlideModalUI"
interface SlideModalProps {
  modalButton: React.ReactElement // 부모로부터 전달받을 버튼
  modalTitle: string
  modalContent: string
  primaryButtonText: string
  primaryButtonOnPress: () => void
  secondaryButtonText: string
  secondaryButtonOnPress: () => void
  autoClose? : boolean
}

const SlideModal: React.FC<SlideModalProps> = ({
  modalButton,
  modalTitle,
  modalContent,
  primaryButtonText,
  primaryButtonOnPress,
  secondaryButtonText,
  secondaryButtonOnPress,
  autoClose = true,
}: SlideModalProps) => {
  const [modalVisible, setModalVisible] = useState(false)
  const toggleModal = () => {
    console.log("v toggleModal modalVisible", modalVisible)
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

  const handlePrimaryButtonPress = () => {
    primaryButtonOnPress()
    if (autoClose) {
      setModalVisible(false)
    }
  }


  const handleSecondaryButtonPress = () => {
    secondaryButtonOnPress()
    if (autoClose) {
      setModalVisible(false)
    }
  }

  return (
    <View className="flex-1 justify-center items-center">
      {modalButtonWithToggle}
      <SlideModalUI
        modalTitle={modalTitle}
        modalContent={modalContent}
        primaryButtonText={primaryButtonText}
        primaryButtonOnPress={handlePrimaryButtonPress}
        secondaryButtonText={secondaryButtonText}
        secondaryButtonOnPress={handleSecondaryButtonPress}
        isVisible={modalVisible}
        setVisible={setModalVisible}
      />
    </View>
  )
}

export default SlideModal
