import { useTranslation } from "react-i18next"
import { Text, View } from "react-native"

import { Link } from "expo-router"

export default function TabOneScreen() {
  const { t } = useTranslation()
  return (
    <View>
      <Text>{t("index.title")}</Text>
      <Text>{t("index.catchphrase")}</Text>
      <Link href="/(tabs)/main">{t("index.lookArround")}</Link>
    </View>
  )
}
