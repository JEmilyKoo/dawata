import { TouchableOpacity, View } from 'react-native'

import CheckIconDisabled from '@/assets/icons/check-disabled.svg'
import CheckIcon from '@/assets/icons/check.svg'

export default function RoundCheckBox({
  isChecked,
  setChecked,
  disabled,
}: {
  isChecked: boolean
  setChecked: (isChecked: boolean) => void
  disabled?: boolean
}) {
  return (
    <View>
      {disabled ? (
        <TouchableOpacity
          className={`w-5 h-5 rounded-full border-2
      ${isChecked ? 'border-secondary' : 'bg-white border-bord'}`}
          onPress={() => setChecked(!isChecked)}>
          {isChecked && <CheckIconDisabled />}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          className={`w-5 h-5 rounded-full border-2
      ${isChecked ? 'border-primary' : 'bg-white border-secondary'}`}
          onPress={() => setChecked(!isChecked)}>
          {isChecked && <CheckIcon />}
        </TouchableOpacity>
      )}
    </View>
  )
}
