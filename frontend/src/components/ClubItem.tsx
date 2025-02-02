import { Image, Text, TouchableOpacity, View } from "react-native"

import ChevronDownIcon from "@/assets/icons/chevron-down.svg"

interface ClubInfo {
  clubId: string
  name: string
  img: any
  category: string
  createdAt: string
  participantInfo: ParticipantInfo[]
}

interface ParticipantInfo {
  email: string
  name: string
  img: any
  createdAt: string
}

export default function ClubItem({ clubInfo }: { clubInfo: ClubInfo }) {
  return (
    <TouchableOpacity
      key={clubInfo.clubId}
      className="flex-row justify-between items-center pb-4 rounded-xl mb-3">
      <Image
        source={clubInfo.img}
        className="w-6 h-6 rounded-xl mb-2"
      />
      <View className="flex-1 ml-2">
        <View className="flex-row items-center">
          <Text className="text-base font-medium mb-1">{clubInfo.name}</Text>
          <Text className="text-sm text-gray-500 ml-2">
            {`#${clubInfo.category} `}
          </Text>
        </View>
        <View className="flex-row space-x-1">
          {clubInfo.participantInfo.map((participant, index) => (
            <View
              key={index}
              className="w-5 h-5 rounded-full bg-gray-300 pr-2">
              <Image
                source={participant.img}
                style={{ width: 16, height: 16 }}
              />
            </View>
          ))}
        </View>
        <View className="flex-row space-x-1">
          <Text className="text-xs text-text-primary">
            {clubInfo.createdAt}
          </Text>
        </View>
      </View>
      <ChevronDownIcon
        height={24}
        width={24}
      />
    </TouchableOpacity>
  )
}
