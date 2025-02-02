import { Image, Text, TouchableOpacity, View } from "react-native"

import ChevronDownIcon from "@/assets/icons/chevron-down.svg"

interface NoticeInfo {
  id: number // 알림의 고유 ID
  noticeType: string // 알림 유형
  read: boolean // 알림 읽음 여부
  deleted: boolean // 알림 삭제 여부
  createdAt: string
}

export default function NoticeItem({ noticeInfo }: { noticeInfo: NoticeInfo }) {
  return (
    <View
      className={noticeInfo.read ? "text-text-secondary" : "text-text-primary"}>
      <TouchableOpacity
        key={noticeInfo.id}
        className="flex-row justify-between items-center pb-4 rounded-xl mb-3">
        <View className="flex-1 ml-2">
          <View className="flex-row justify-between">
            <Text className="text-base font-medium mb-1">
              {noticeInfo.noticeType}
            </Text>
            <Text className="text-sm text-gray-500 ml-2 items-end">
              {noticeInfo.createdAt}
            </Text>
          </View>
          <View className="flex-row space-x-1 ">
            <Text className="text-xs text-text-primary">알림에 대한 정보</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}
