import { useTranslation } from "react-i18next"
import { Image, View } from "react-native"

import { Tabs } from "expo-router"

import AppointmentIcon from "@/assets/icons/appointment.svg"
import MainIcon from "@/assets/icons/main.svg"
import NoticeIcon from "@/assets/icons/notice.svg"
import ProfileIcon from "@/assets/icons/profile.svg"
import TabBarIcon from "@/components/TabBarIcon"
import colors from "@/constants/Colors"

export default function TabLayout() {
  const { t } = useTranslation()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondary,
        headerShown: false,
        tabBarStyle: {
          marginTop: 10,
          height: 85,
          paddingHorizontal: 10,
        },
        tabBarItemStyle: {
          borderTopWidth: 1,
          marginHorizontal: 10,
          paddingTop: 10,
        },
      }}>
      <Tabs.Screen
        name="main"
        options={({ navigation }) => ({
          title: t("main"),
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              Icon={MainIcon}
              color={color}
            />
          ),
          tabBarItemStyle: {
            borderTopWidth: 1,
            borderTopColor: navigation.isFocused()
              ? colors.primary
              : colors.secondary,
          },
        })}
      />
      <Tabs.Screen
        name="appointment"
        options={({ navigation }) => ({
          title: t("appointment"),
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              Icon={AppointmentIcon}
              color={color}
            />
          ),
          tabBarItemStyle: {
            borderTopWidth: 1,
            borderTopColor: navigation.isFocused()
              ? colors.primary
              : colors.secondary,
          },
        })}
      />
      <Tabs.Screen
        name="live"
        options={{
          title: t("live"),
          tabBarLabel: () => null,
          tabBarIcon: () => (
            <View style={{ width: 60 }}>
              <Image
                source={require("@/assets/icons/live.png")}
                style={{
                  width: 54,
                  height: 54,
                }}
              />
            </View>
          ),
          tabBarItemStyle: {
            marginVertical: 8,
          },
        }}
      />
      <Tabs.Screen
        name="notice"
        options={({ navigation }) => ({
          title: t("notice"),
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              Icon={NoticeIcon}
              color={color}
            />
          ),
          tabBarItemStyle: {
            borderTopWidth: 1,
            borderTopColor: navigation.isFocused()
              ? colors.primary
              : colors.secondary,
          },
        })}
      />
      <Tabs.Screen
        name="profile"
        options={({ navigation }) => ({
          title: t("profile"),
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              Icon={ProfileIcon}
              color={color}
            />
          ),
          tabBarItemStyle: {
            borderTopWidth: 1,
            borderTopColor: navigation.isFocused()
              ? colors.primary
              : colors.secondary,
          },
        })}
      />
    </Tabs>
  )
}
