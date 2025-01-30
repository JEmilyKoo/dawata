import { initReactI18next } from "react-i18next"
import * as RNLocalize from "react-native-localize"

import i18n from "i18next"

import ko from "@/locales/ko.json"

i18n.use(initReactI18next).init({
  resources: { ko: { translation: ko } },
  lng: RNLocalize.getLocales()[0].languageCode,
  fallbackLng: "ko",
})

export default i18n
