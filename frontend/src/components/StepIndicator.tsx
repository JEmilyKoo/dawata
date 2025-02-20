import { View } from 'react-native'

const StepIndicator = ({
  step,
  nowStep,
}: {
  step: number
  nowStep: number
}) => {
  const stepMap = Array.from({ length: step }, (_, i) => i + 1)
  return (
    <View className="flex-row w-full h-[2px] px-4">
      {stepMap.map((s) => (
        <View
          key={s}
          className={`flex-1 ${s === nowStep ? 'bg-text-primary' : 'bg-bord'}`}
        />
      ))}
    </View>
  )
}

export default StepIndicator
