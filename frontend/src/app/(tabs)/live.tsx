import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { WebView } from "react-native-webview"

import BottomSheet from "@/components/BottomSheet"
import * as Location from "expo-location"

interface LocationRecord {
  latitude: number
  longitude: number
  timestamp: number
}

interface User {
  id: string
  name: string
  avatar: string
  location?: LocationRecord
  details: {
    status: string
    lastActive: string
  }
}


export default function LiveScreen() {
  const { t } = useTranslation()
  const [locationRecords, setLocationRecords] = useState<LocationRecord[]>([])
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const TMAP_API_KEY = "YBRKLWh8yp2cxRr7ZrktOariTykJhXPBaIQFLJiV"
  const [index, setIndex] = useState(0);

  const handleChange = (newIndex: number) => {
    console.log('새로운 index:', newIndex);
    setIndex(newIndex); // 상태 업데이트 등 외부 로직 처리
  };
  // 샘플 사용자 데이터
  const users: User[] = [
    {
      id: "1",
      name: "고성태",
      avatar: require("@/assets/avatars/user1.png"),
      details: {
        status: "도착",
        lastActive: "3분 5초 전 예정",
      },
    },
    {
      id: "2",
      name: "구정은",
      avatar: require("@/assets/avatars/user2.png"),
      details: {
        status: "미도착",
        lastActive: "10분 전",
      },
    },
    // ... 더 많은 사용자 추가 가능
  ]

  useEffect(() => {
    ;(async () => {
      // 위치 권한 요청
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        console.error("위치 권한이 거부되었습니다")
        return
      }

      // 실시간 위치 추적 시작
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // 5초마다 업데이트
          distanceInterval: 5, // 5미터 이상 이동 시 업데이트
        },
        (location) => {
          setCurrentLocation(location)
          setLocationRecords((prev) => [
            ...prev,
            {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              timestamp: location.timestamp,
            },
          ])

          // 지도에 현재 위치 표시를 위한 JavaScript 실행
          webViewRef.current?.injectJavaScript(`
            updateMyLocation(${location.coords.latitude}, ${location.coords.longitude});
          `)
        },
      )
    })()
  }, [])

  const webViewRef = React.useRef<WebView>(null)

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
        <script src="https://apis.openapi.sk.com/tmap/vectorjs?version=1&appKey=${TMAP_API_KEY}"></script>
        <script type="text/javascript">
          let map;
          let marker;

          function initTmap() {
            map = new Tmapv3.Map("map_div", {
              center: new Tmapv3.LatLng(37.566481622437934, 126.98502302169841),
              width: "100%",
              height: "100%",
              zoom: 18
            });
          }

          function updateMyLocation(lat, lng) {
            const position = new Tmapv3.LatLng(lat, lng);

            if (!marker) {
              marker = new Tmapv3.Marker({
                position: position,
                map: map
              });
            } else {
              marker.setPosition(position);
            }

            map.setCenter(position);
          }
        </script>
        <style>
          html, body, #map_div {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
          }
        </style>
      </head>
      <body onload="initTmap()">
        <div id="map_div"></div>
      </body>
    </html>
  `

  const renderBottomSheetContent = () => (
    <View className="flex-1 p-4">
      <View className="mb-5">
        <View className="flex-row justify-center mb-5">
          <View className="flex-row items-center mx-2">
            <View className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2" />
            <Text>도착</Text>
          </View>
          <View className="flex-row items-center mx-2">
            <View className="w-2.5 h-2.5 rounded-full bg-yellow-400 mr-2" />
            <Text>미도착</Text>
          </View>
          <View className="flex-row items-center mx-2">
            <View className="w-2.5 h-2.5 rounded-full bg-gray-300 mr-2" />
            <Text>지각/불참</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}>
          <View className="flex-row flex-wrap justify-between py-2">
            {users.map((user) => (
              <TouchableOpacity
                key={user.id}
                className={`p-4 mr-2 bg-gray-200 rounded-xl min-w-24 items-center ${selectedUser?.id === user.id ? "bg-gray-300 border-2 border-blue-500" : ""}`}
                onPress={() => setSelectedUser(user)}>
                <Image
                  source={user.avatar}
                  className="w-12 h-12 rounded-full mb-2"
                />
                <Text className="text-base font-semibold mb-1">
                  {user.name}
                </Text>
                <Text className="text-xs text-gray-500">
                  {user.details.status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {selectedUser && (
          <View className="flex-row items-center p-4 bg-gray-100 rounded-2xl mt-5">
            <Image
              source={selectedUser.avatar}
              className="w-16 h-16 rounded-full"
            />
            <View className="flex-1 ml-3">
              <Text className="text-lg font-semibold">{selectedUser.name}</Text>
              <Text className="text-sm text-gray-500">
                {selectedUser.details.lastActive}
              </Text>
            </View>
            <View className="flex-row gap-2">
              <TouchableOpacity className="p-2 bg-gray-300 rounded-xl">
                <Text>채팅</Text>
              </TouchableOpacity>
              <TouchableOpacity className="p-2 bg-gray-300 rounded-xl">
                <Text>전화걸기</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  )

  return Platform.OS === "web" ? (
    <View className="flex-1">
      <View className="relative flex-1 overflow-hidden border-2 border-red-500 z-0">
        <iframe
          srcDoc={htmlContent}
          className="w-full h-full absolute top-0 left-0 z-10"
          style={{
            position: "absolute", // position 속성 추가
            top: 0,
            left: 0,
            right: 0,
            bottom: 0, // WebView 위치 고정
            zIndex: 0, // iframe의 z-index를 낮추기 위해 0으로 설정
          }}
        />
      </View>
      <View className="absolute bottom-0 left-0 right-0 z-20 border-2 border-blue-500">
      <View style={{ flex: 1 }}>
      <BottomSheet handleChange={handleChange}>
        <Text>dfddfd</Text>
      </BottomSheet>
    </View>
      </View>
    </View>
  ) : (
    <View className="flex-1">
      <View className="relative flex-1">
        <WebView
          ref={webViewRef}
          source={{ html: htmlContent }}
          className="flex-1"
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent
            console.warn("WebView error: ", nativeEvent)
          }}
        />
      <BottomSheet handleChange={handleChange}>
        <Text>dfddfd</Text>
      </BottomSheet>
      </View>
    </View>
  )
}
