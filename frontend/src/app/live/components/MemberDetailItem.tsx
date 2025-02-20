import {
  Alert,
  Image,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native'

import { postUrgentNotification } from '@/apis/live'
import CallIcon from '@/assets/icons/call.svg'
import HurryIcon from '@/assets/icons/hurry.svg'
import ImageThumbnail from '@/components/ImageThumbnail'
import useFormattedTime from '@/hooks/useFormattedTime'
import { LiveMember } from '@/types/live'

const userImages = [
  require('@/assets/avatars/user1.png'),
  require('@/assets/avatars/user2.png'),

  require('@/assets/avatars/user3.png'),
  require('@/assets/avatars/user4.png'),
  require('@/assets/avatars/user5.png'),
  require('@/assets/avatars/user6.png'),
  require('@/assets/avatars/user7.png'),
  require('@/assets/avatars/user8.png'),
  require('@/assets/avatars/user1.png'),
  require('@/assets/avatars/user2.png'),
  require('@/assets/avatars/user3.png'),
  require('@/assets/avatars/user4.png'),
  require('@/assets/avatars/user5.png'),
  require('@/assets/avatars/user6.png'),
  require('@/assets/avatars/user7.png'),
  require('@/assets/avatars/user8.png'),
]
export const MemberDetailItem = ({
  member,
  liveAppointmentId,
}: {
  member: LiveMember | null
  liveAppointmentId: number
}) => {
  const postUrgent = async () => {
    if (!member) return
    await postUrgentNotification(liveAppointmentId, member.memberId)
    ToastAndroid.show('재촉 알림이 전송되었습니다.', ToastAndroid.SHORT)
  }
  const getOverlayColor2 = (arrivalState: string) => {
    if (arrivalState === 'NOT_ARRIVED')
      return 'border-light-yellow rounded-full border-4 '
    if (arrivalState === 'ARRIVED')
      return 'border-light-green rounded-full border-4 '
    if (arrivalState === 'LATE')
      return 'border-light-red rounded-full border-4 '
    return 'border-light-gray rounded-full border-4 '
  }

  return (
    member && (
      <View>
        <View
          className="flex-row p-4 border-2 border-bord rounded-2xl my-2 justify-between items-center pb-4 rounded-xl"
          key={member.memberId}>
          <ImageThumbnail
            img={member.img}
            className={getOverlayColor2(member.arrivalState)}
            defaultImg={userImages[member.memberId % 10]}
            width={45}
            height={45}
          />
          <View className="flex-1 ml-3">
            <Text className="text-lg font-semibold text-text-primary">
              {member.nickname}
            </Text>
            <Text className="text-sm text-light-red">
              {useFormattedTime(member.estimatedTime)} 후 도착 예정
            </Text>
          </View>
          <View className="flex-row gap-2">
            <TouchableOpacity
              className="p-2 rounded-full items-center"
              onPress={postUrgent}>
              <View className="size-8 bg-primary rounded-full items-center justify-center">
                <HurryIcon
                  width={14}
                  height={14}
                />
              </View>
              <Text className="text-xs text-text-primary pt-1">재촉</Text>
            </TouchableOpacity>

            <TouchableOpacity className="p-2 rounded-full items-center">
              <View className="size-8 bg-light-green rounded-full items-center justify-center">
                <CallIcon
                  width={14}
                  height={14}
                />
              </View>
              <Text className="text-xs text-text-primary pt-1">화상통화</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  )
}

export default MemberDetailItem
