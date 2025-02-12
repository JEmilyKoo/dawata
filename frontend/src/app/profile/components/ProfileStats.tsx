import { Dimensions, Text, View } from 'react-native'
import { PieChart } from 'react-native-chart-kit'

import { UserAttendanceStatus } from '@/types/profile'

interface ProfileStatsProps {
  attendanceStatus: UserAttendanceStatus[]
}

const ProfileStats = ({ attendanceStatus }: ProfileStatsProps) => {
  const totalCount = attendanceStatus.reduce(
    (acc, curr) => acc + curr.totalCount,
    0,
  )
  const appointmentTotalCount = attendanceStatus.reduce(
    (acc, curr) => acc + curr.appointmentTotalCount,
    0,
  )
  const lateTotalCount = attendanceStatus.reduce(
    (acc, curr) => acc + curr.lateTotalCount,
    0,
  )
  const onTimeAttendanceTotalCount = attendanceStatus.reduce(
    (acc, curr) => acc + curr.onTimeAttendanceTotalCount,
    0,
  )
  const data = [
    {
      name: '정시 도착',

      population: appointmentTotalCount,
      color: '#4CAF50',
      legendFontColor: '#7F7F7F',

      legendFontSize: 15,
    },
    {
      name: '지각',
      population: lateTotalCount,
      color: '#FF9800',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: '노쇼',
      population: onTimeAttendanceTotalCount,
      color: '#FF5722',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ]

  return (
    <View className="items-center mb-4">
      <Text className="text-xl mb-2">
        총 {totalCount}번의 약속 중 {appointmentTotalCount}번 정시 도착
      </Text>
      <PieChart
        data={data}
        width={Dimensions.get('window').width - 40}
        height={220}
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#d64c00',
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        innerRadius="50%" // 도넛 모양 설정
        outerRadius="80%" // 원의 크기 설정
      />
    </View>
  )
}

export default ProfileStats
