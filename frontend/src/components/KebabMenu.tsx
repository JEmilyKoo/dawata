import { Text, TouchableOpacity, View } from 'react-native'

import { AppointmentDetailInfo } from '@/types/appointment'

interface KebabMenuProps {
  isVisible: boolean
  onClose: () => void
  isHost: boolean
  onEdit?: () => void
  onDelete?: () => void
  onToggleParticipation: () => void
  isAttending: boolean
}

export default function KebabMenu({
  isVisible,
  onClose,
  isHost,
  onEdit,
  onDelete,
  onToggleParticipation,
  isAttending,
}: KebabMenuProps) {
  if (!isVisible) return null

  return (
    <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/30">
      <TouchableOpacity
        className="flex-1"
        onPress={onClose}>
        <View className="absolute top-12 right-4 bg-white rounded-lg shadow-lg w-40">
          {isHost && (
            <>
              <TouchableOpacity
                className="p-4 border-b border-gray-200"
                onPress={() => {
                  onEdit?.()
                  onClose()
                }}>
                <Text>수정</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="p-4 border-b border-gray-200"
                onPress={() => {
                  onToggleParticipation()
                  onClose()
                }}>
                <Text>{isAttending ? '불참' : '참여'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="p-4"
                onPress={() => {
                  onDelete?.()
                  onClose()
                }}>
                <Text className="text-red-500">삭제</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </TouchableOpacity>
    </View>
  )
}
