import { useTranslation } from 'react-i18next'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

import BackButton from '@/components/BackButton'
import NoticeItem from '@/components/NoticeItem'

interface NoticeInfo {
  id: number // 알림의 고유 ID
  noticeType: string // 알림 유형
  read: boolean // 알림 읽음 여부
  deleted: boolean // 알림 삭제 여부
  createdAt: string
}

const noticeInfo: NoticeInfo[] = [
  {
    id: 1,
    noticeType: '알림',
    read: false,
    deleted: false,
    createdAt: '2025-01-01T00:00:00',
  },
  {
    id: 2,
    noticeType: '알림',
    read: true,
    deleted: false,
    createdAt: '2025-01-01T00:00:00',
  },
  {
    id: 3,
    noticeType: '알림',
    read: true,
    deleted: false,
    createdAt: '2025-01-01T00:00:00',
  },
  {
    id: 4,
    noticeType: '알림',
    read: true,
    deleted: false,
    createdAt: '2025-01-01T00:00:00',
  },
  {
    id: 2,
    noticeType: '알림',
    read: true,
    deleted: false,
    createdAt: '2025-01-01T00:00:00',
  },
  {
    id: 2,
    noticeType: '알림',
    read: true,
    deleted: false,
    createdAt: '2025-01-01T00:00:00',
  },
  {
    id: 4,
    noticeType: '알림',
    read: true,
    deleted: false,
    createdAt: '2025-01-01T00:00:00',
  },
  {
    id: 2,
    noticeType: '알림',
    read: true,
    deleted: false,
    createdAt: '2025-01-01T00:00:00',
  },
  {
    id: 2,
    noticeType: '알림',
    read: true,
    deleted: false,
    createdAt: '2025-01-01T00:00:00',
  },
  {
    id: 4,
    noticeType: '알림',
    read: true,
    deleted: false,
    createdAt: '2025-01-01T00:00:00',
  },
  {
    id: 2,
    noticeType: '알림',
    read: true,
    deleted: false,
    createdAt: '2025-01-01T00:00:00',
  },
  {
    id: 2,
    noticeType: '알림',
    read: true,
    deleted: false,
    createdAt: '2025-01-01T00:00:00',
  },
]
export default function TabOneScreen() {
  const { t } = useTranslation()
  return (
    <View className="flex-1 bg-white">
      <View className="flex-row p-4 border-b border-bord">
        <TouchableOpacity className="mr-4">
          <BackButton />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-xl font-bold mt-2">{t('notice')}</Text>
        </View>
      </View>
      <ScrollView>
        {noticeInfo.map(
          (noticeInfo) =>
            !noticeInfo.deleted && (
              <View className="px-4">
                <NoticeItem noticeInfo={noticeInfo} />
              </View>
            ),
        )}
      </ScrollView>
    </View>
  )
}
