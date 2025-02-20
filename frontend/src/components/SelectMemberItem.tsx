import { Text, TouchableOpacity, View } from 'react-native'

import ImageThumbnail from './ImageThumbnail'
import RoundCheckBox from './RoundCheckBox'

interface SelectMemberItemProps {
  disabled: boolean
  img: string
  name: string
  email: string
  checked: boolean
  setChecked: (checked: boolean) => void
}

const SelectMemberItem = ({
  disabled,
  img,
  name,
  email,
  checked,
  setChecked,
}: SelectMemberItemProps) => {
  return (
    <TouchableOpacity
      onPress={() => {
        if (!disabled) setChecked(!checked)
      }}
      className="flex-row p-2  my-2 justify-between items-center ">
      <ImageThumbnail
        img={img}
        defaultImg={require('@/assets/avatars/user1.png')}
        width={45}
        height={45}
        className="rounded-full"
      />
      <View className="flex-1 ml-3 font-regular ">
        <Text className="text-base text-text-primary">{name}</Text>
        <Text className="text-sm text-secondary">{email}</Text>
      </View>
      <View className="flex-row gap-2">
        <View className="p-2 rounded-full items-center">
          <RoundCheckBox
            disabled={disabled}
            isChecked={checked}
            setChecked={setChecked}
          />
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default SelectMemberItem
