import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Link, Stack } from "expo-router"
import { useTranslation } from "react-i18next"

export default function NotFoundScreen() {
  const { t } = useTranslation()
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View className="flex-1 items-center justify-center bg-white">
       <Text className="text-xl px-10 mb-4 text-text-primary text-center">
        에러가 발생했습니다. <br/> 다시 시도해주세요.
      </Text>
      <Link href="/(tabs)/main">
        <TouchableOpacity className="bg-primary p-2 rounded">
          <Text className="text-white text-center text-bold">
            {t('goToHome')}
          </Text>
        </TouchableOpacity>
      </Link>
      </View>

    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
})
