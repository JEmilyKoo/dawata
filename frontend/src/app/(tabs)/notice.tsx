import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SafeAreaView, ScrollView, Text, View } from 'react-native'

import { getNotices } from '@/apis/notice'
import NoticeItem from '@/components/NoticeItem'
import TopHeader from '@/components/TopHeader'

interface NoticeInfo {
  id: number // 알림의 고유 ID
  noticeType: string // 알림 유형
  read: boolean // 알림 읽음 여부
  deleted: boolean // 알림 삭제 여부
  createdAt: string
}

export default function TabOneScreen() {
  const [noticeInfo, setNoticeInfo] = useState<NoticeInfo[]>([])
  const { t } = useTranslation()

  useEffect(() => {
    const fetchNotices = async () => {
      const notices = await getNotices()

      if (notices) {
        setNoticeInfo(notices.content)
      }
      console.log(notices)
    }
    fetchNotices()
  }, [])
  return (
    <SafeAreaView className="flex-1 bg-white">
      <TopHeader title={t('notice')} />
      <ScrollView>
        {noticeInfo.length != 0 &&
          noticeInfo.map(
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
      {noticeInfo.length == 0 && (
        <View className="flex-1  bg-white h-full">
          <View className="items-center justify-center">
            <Text>알림이 없습니다.</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  )
}
