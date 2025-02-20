import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SafeAreaView, ScrollView, Text, View } from 'react-native'

import { getNotices } from '@/apis/notice'
import { updateNoticeRead } from '@/apis/notice'
import NoticeItem from '@/components/NoticeItem'
import TopHeader from '@/components/TopHeader'

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

export default function TabOneScreen() {
  const [noticeInfo, setNoticeInfo] = useState<NoticeInfo[]>([])
  const { t } = useTranslation()
  const sendRead = async (id: number) => {
    const result = await updateNoticeRead({ noticeId: id })
    let newNotice = noticeInfo.map((item) =>
      item.id == id ? { ...item, read: true } : item,
    )
    setNoticeInfo(newNotice)
  }
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
          noticeInfo.map((noticeInfo) => (
            <View
              className="px-4"
              key={noticeInfo.id}>
              <NoticeItem
                noticeInfo={noticeInfo}
                sendRead={sendRead}
              />
            </View>
          ))}
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
