import { Text, TouchableOpacity, View } from 'react-native'

import ImageThumbnail from '@/components/ImageThumbnail'

interface NoticeInfo {
  id: number // 알림의 고유 ID
  type: string // 알림 유형
  read: boolean // 알림 읽음 여부
  memberInfoResponse: {
    img: string
  }
  str: string
  createdAt: string
}

export default function NoticeItem({
  noticeInfo,
  sendRead,
}: {
  noticeInfo: NoticeInfo
  sendRead: (id: number) => void
}) {
  return (
    <View
      className={noticeInfo.read ? 'text-text-secondary' : 'text-text-primary'}>
      <TouchableOpacity
        onPress={() => sendRead(noticeInfo.id)}
        key={noticeInfo.id}
        className="flex-row justify-between items-center pb-4 rounded-xl mb-3">
        <ImageThumbnail
          img={noticeInfo.memberInfoResponse.img}
          defaultImg={require('@/assets/avatars/user1.png')}
          width={48}
          height={48}
          className="rounded-full border border-bord"
        />
        <View className="flex-1 ml-2">
          <View className="flex-row justify-between">
            <Text
              className={`text-base font-medium mb-1
            ${noticeInfo.read ? 'text-text-secondary' : 'text-text-primary'}`}>
              {noticeInfo.str}
            </Text>

            <Text
              className={`text-sm ml-2 items-end
            ${noticeInfo.read ? 'text-border' : 'text-secondary'}`}>
              {new Date(noticeInfo.createdAt).toLocaleString('ko', {
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}
