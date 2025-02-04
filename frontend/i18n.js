import { initReactI18next } from "react-i18next"
import { Platform } from "react-native"

import { getLocales } from "expo-localization"
import i18n from "i18next"

import ko from "@/locales/ko.json"

let currentLocale =
  __DEV__ && Platform.OS === "web"
    ? navigator.language
    : getLocales()[0]?.languageCode

i18n.use(initReactI18next).init({
  resources: { ko: { translation: ko } },
  lng: currentLocale,
  fallbackLng: "ko",
})

export default i18n
