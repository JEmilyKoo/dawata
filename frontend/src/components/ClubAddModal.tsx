import { TouchableOpacity, View } from "react-native"

import { createClub } from "@/apis/club"
// SlideModal 컴포넌트 가져오기

import PlusIcon from "@/assets/icons/plus.svg"

import SlideModal from "./SlideModal"

interface CreateClubParams {
  name: string
  category: string
}

const createClubButton = async () => {
  try {
    const param: CreateClubParams = {
      name: "새그룹" + Math.floor(Math.random() * 100000000000),
      category: "FRIEND",
    }
    const result = await createClub(param)
    console.log("🦖 createClub 결과:", result)
  } catch (error) {
    console.error("그룹 생성 중 오류 발생:", error)
  }
}

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
        primaryButtonOnPress={createClubButton}
        secondaryButtonText="기존 그룹 참가"
        secondaryButtonOnPress={() => console.log("기존 그룹 참가")}
      />
    </View>
  )
}

export default ClubAddModal
