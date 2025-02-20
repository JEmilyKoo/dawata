import { useTranslation } from 'react-i18next'
import { Text, TouchableOpacity, View } from 'react-native'

const PrevNextButton = ({
  onPressPrev,
  onPressNext,
  nextText,
}: {
  onPressPrev?: () => void
  onPressNext: () => void
  nextText?: string
}) => {
  const { t } = useTranslation()
  return (
    <View
      className={`flex-row justify-between w-full p-2 ${onPressPrev ?? 'pr-3'}`}>
      {onPressPrev && (
        <TouchableOpacity
          className="bg-bord items-center p-3 rounded w-1/4"
          onPress={onPressPrev}>
          <Text className="text-text-primary text-center font-bold">
            {t('prev')}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        className={`bg-primary items-center rounded p-3 ${onPressPrev ? ' ml-1 mr-1 w-3/4' : 'mr-3 rounded w-full'}`}
        onPress={onPressNext}>
        <Text className="text-white text-center font-bold">
          {nextText ?? t('next')}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default PrevNextButton
