import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import CopyIcon from '@/assets/icons/copy.svg'
import MoreIcon from '@/assets/icons/more.svg'
import { ClubHeaderProps } from '@/types/club'

const ClubHeader: React.FC<ClubHeaderProps> = ({
  name,
  category,
  teamCode,
  createdAt,
}) => (
  <View className="flex-row p-4 border-b border-bord">
    <View className="flex-1">
      <Text className="text-xl font-bold">{name}</Text>

      <View className="flex-row items-center mt-1">
        <Text className="text-sm text-secondary">#{category}</Text>
        <Text className="text-sm text-secondary ml-2">{createdAt} 생성</Text>
      </View>
      <View className="flex-row items-center mt-1">
        <Text className="text-sm text-secondary">그룹 초대 코드</Text>
        <Text className="text-sm text-secondary mx-2">{teamCode}</Text>
        <TouchableOpacity>
          <CopyIcon
            height={20}
            width={20}
          />
        </TouchableOpacity>
      </View>
    </View>
    <TouchableOpacity className="p-2">
      <MoreIcon
        height={24}
        width={24}
      />
    </TouchableOpacity>
  </View>
)

export default ClubHeader
