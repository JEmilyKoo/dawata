import { useTranslation } from 'react-i18next'
import {
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native'

import NoticeItem from '@/components/NoticeItem'
import TopHeader from '@/components/TopHeader'

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
    <SafeAreaView className="flex-1 bg-white">
      <TopHeader title={t('notice')} />
      <ScrollView>
        {noticeInfo.map(
          (noticeInfo) =>
            !noticeInfo.deleted && (
              <View
                className="px-4"
                key={noticeInfo.id}>
                <NoticeItem noticeInfo={noticeInfo} />
              </View>
            ),
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
