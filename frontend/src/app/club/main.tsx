import React from "react"
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { Calendar, LocaleConfig } from "react-native-calendars"

import {
  ActionSheetProps,
  useActionSheet,
} from "@expo/react-native-action-sheet"
import { useLocalSearchParams } from "expo-router"

import ChevronLeftIcon from "@/assets/icons/chevron-left.svg"
import CopyIcon from "@/assets/icons/copy.svg"
import MoreIcon from "@/assets/icons/more.svg"
import PlusIcon from "@/assets/icons/plus.svg"
import BackButton from "@/components/BackButton"
import ClubAddModal from "@/components/ClubAddModal"

LocaleConfig.locales["kr"] = {
  monthNames: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  monthNamesShort: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  dayNames: [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ],
  dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
}
LocaleConfig.defaultLocale = "kr"

type RouteParams = {
  clubId: string
}

function ClubMain() {
  const params = useLocalSearchParams<RouteParams>()
  console.log("clubId:", params)

  const markedDates = {
    "2025-01-21": { marked: true, dotColor: "#ff8339" },
    "2025-01-22": { marked: true, dotColor: "#ff8339" },
    "2025-01-23": { marked: true, dotColor: "#ff8339" },
    "2025-01-24": { marked: true, dotColor: "#ff8339" },
    "2025-01-25": { marked: true, dotColor: "#ff8339" },
  }
  interface Club {
    id: string
    name: string
    image: any
    tag: string
  }
  const myClubs: Club[] = [
    {
      id: "1",
      name: "No.1",
      image: require("@/assets/clubs/club1.png"),
      tag: "#스터디",
    },
  ]

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* 헤더 */}
      <View className="flex-row p-4 border-b border-border">
        <TouchableOpacity className="mr-4">
          <BackButton />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-xl font-bold">No.1</Text>
          <View className="flex-row items-center mt-1">
            <Text className="text-sm text-secondary">#스터디</Text>
            <Text className="text-sm text-secondary ml-2">2025-01-07 생성</Text>
          </View>
          <View className="flex-row items-center mt-1">
            <Text className="text-sm text-secondary">그룹 초대 코드</Text>
            <Text className="text-sm text-secondary mx-2">H9UF6K</Text>
            <TouchableOpacity>
              <CopyIcon
                height={20}
                width={20}
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity className="p-2">
          <MoreIcon
            height={24}
            width={24}
          />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* 멤버 리스트 */}
        <View className="p-4 border-b border-border">
          <TouchableOpacity className="flex-row justify-between items-center p-3 border border-border rounded-lg mb-4">
            <Text className="text-base">멤버 리스트</Text>
            <MoreIcon
              height={20}
              width={20}
            />
          </TouchableOpacity>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}>
            <View className="flex-row">
              {Array.from({ length: 8 }).map((_, i) => (
                <View
                  key={i}
                  className="flex-col mr-4">
                  {[...Array(3)].map((_, j) => {
                    const index = i * 3 + j // 아이템 인덱스 계산
                    return (
                      <View
                        key={index}
                        className="items-center mb-4">
                        <View className="w-12 h-12 rounded-full bg-gray-200 mb-1" />
                        <Text className="text-xs">멤버{index + 1}</Text>
                      </View>
                    )
                  })}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* 캘린더 섹션 */}
        <View className="p-4">
          <Text className="text-lg font-bold mb-4">No.1 캘린더</Text>
          <Calendar
            className="border border-border rounded-lg p-2"
            theme={{
              backgroundColor: "#ffffff",
              calendarBackground: "#ffffff",
              textSectionTitleColor: "#9c9c9c",
              selectedDayBackgroundColor: "#ff8339",
              selectedDayTextColor: "#ffffff",
              todayTextColor: "#ff8339",
              dayTextColor: "#1f1f1f",
              textDisabledColor: "#e6e6e6",
              dotColor: "#ff8339",
              selectedDotColor: "#ffffff",
              arrowColor: "#ff8339",
              monthTextColor: "#1f1f1f",
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 14,
            }}
            markedDates={markedDates}
            markingType={"dot"}
            enableSwipeMonths={true}
            current={"2025-01-21"}
          />
        </View>

        {/* 스터디 목록 */}
        <View className="p-4 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <TouchableOpacity
              key={i}
              className="flex-row p-4 border border-border rounded-lg">
              <Image
                source={myClubs[0].image}
                className="w-12 h-12 rounded-lg bg-gray-200 mr-4"
              />
              <View className="flex-1">
                <Text className="font-bold">1월 {25 - i}일 스터디</Text>
                <Text className="text-sm text-secondary mt-1">오후 7:00</Text>
                <Text className="text-sm text-secondary">
                  역삼 투썸플레이스 #스터디
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-sm text-secondary mb-1">(6/6)</Text>
                <View className="bg-gray-100 px-3 py-1 rounded">
                  <Text className="text-xs text-secondary">투표 종료</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* 플로팅 버튼 */}
      <View className="absolute right-4 bottom-8">
        <ClubAddModal />
      </View>
    </SafeAreaView>
  )
}

export default ClubMain
