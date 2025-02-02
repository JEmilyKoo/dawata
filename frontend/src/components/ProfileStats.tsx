import { Dimensions, Text, View } from "react-native"
import { PieChart } from "react-native-chart-kit"

const ProfileStats = () => {
  const data = [
    {
      name: "정시 도착",
      population: 15,
      color: "#4CAF50",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "지각",
      population: 3,
      color: "#FF9800",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "노쇼",
      population: 2,
      color: "#FF5722",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ]

  return (
    <View className="items-center mb-4">
      <Text className="text-xl mb-2">총 20번의 약속 중 15번 정시 도착</Text>
      <PieChart
        data={data}
        width={Dimensions.get("window").width - 40}
        height={220}
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#d64c00",
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
