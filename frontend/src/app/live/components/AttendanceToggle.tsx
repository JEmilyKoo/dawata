import { StyleSheet, Text, View } from 'react-native'
import SwitchToggle from 'react-native-switch-toggle'

import Colors from '@/constants/Colors'

import { useAttendance } from '../hooks/useAttendance'

const styles = StyleSheet.create({
  switchContainer: {
    width: 32,
    height: 16,
    borderRadius: 25,
    padding: 2,
  },
  switchCircle: {
    width: 13,
    height: 13,
    borderRadius: 20,
  },
})
const AttendanceToggle = () => {
  const {
    showArrived,
    showNotArrived,
    showAbsent,
    toggleShowArrived,
    toggleShowNotArrived,
    toggleShowAbsent,
  } = useAttendance()

  return (
    <View className="h-4 w-full flex-row items-center justify-center space-x-4">
      <View className="flex-row items-center space-x-1">
        <SwitchToggle
          switchOn={showArrived}
          onPress={toggleShowArrived}
          circleColorOff="white"
          backgroundColorOn={Colors.light.green}
          backgroundColorOff={Colors.border}
          containerStyle={styles.switchContainer}
          circleStyle={styles.switchCircle}
        />
        <Text className="text-xs text-text-primary">도착</Text>
      </View>

      <View className="flex-row items-center space-x-1">
        <SwitchToggle
          switchOn={showNotArrived}
          onPress={toggleShowNotArrived}
          circleColorOff="white"
          backgroundColorOn={Colors.light.yellow}
          backgroundColorOff={Colors.border}
          containerStyle={styles.switchContainer}
          circleStyle={styles.switchCircle}
        />
        <Text className="text-xs text-text-primary">미도착</Text>
      </View>

      <View className="flex-row items-center space-x-1">
        <SwitchToggle
          switchOn={showAbsent}
          onPress={toggleShowAbsent}
          circleColorOff="white"
          backgroundColorOn={Colors.light.red}
          backgroundColorOff={Colors.border}
          containerStyle={styles.switchContainer}
          circleStyle={styles.switchCircle}
        />
        <Text className="text-xs text-text-primary">불참</Text>
      </View>
    </View>
  )
}
export default AttendanceToggle
