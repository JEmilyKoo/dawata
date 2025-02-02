import { TouchableOpacity, View } from "react-native"

// SlideModal 컴포넌트 가져오기

import PlusIcon from "@/assets/icons/plus.svg"

import SlideModal from "./SlideModal"

const ClubAddModal = () => {
  const modalButton = (
    <TouchableOpacity className="w-14 h-14 rounded-full bg-primary items-center justify-center shadow-lg">
      <PlusIcon
        height={30}
        width={30}
        color="#fff"
      />
    </TouchableOpacity>
  )

  return (
    <View className="flex-1 justify-center items-center">
      <SlideModal
        modalButton={modalButton} // modalButton을 전달
        modalTitle="무엇을 할까요?"
        modalContent="새로운 그룹을 생성하려면 그룹 생성을, 기존 그룹에 참가하려면 그룹 참가를 눌러주세요."
        primaryButtonText="새로운 그룹 생성"
        primaryButtonOnPress={() => console.log("새로운 그룹 생성")}
        secondaryButtonText="기존 그룹 참가"
        secondaryButtonOnPress={() => console.log("기존 그룹 참가")}
      />
    </View>
  )
}

export default ClubAddModal
